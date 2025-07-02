# Resolution for Bug df88644: Memory Issue during transcription

## Issue Summary

When the application processed multiple audio files simultaneously, it encountered a heap corruption error that caused the entire application to crash. The error log showed:

```
You have passed language=en, but also have set `forced_decoder_ids` to [[1, None], [2, 50360]] which creates a conflict. `forced_decoder_ids` will be ignored in favor of language=en.
The attention mask is not set and cannot be inferred from input because pad token is same as eos token. As a consequence, you may observe unexpected behavior. Please pass your input's `attention_mask` to obtain reliable results.
python3.11(53924,0x177433000) malloc: Heap corruption detected, free list is damaged at 0x600004c1c230
*** Incorrect guard value: 0
python3.11(53924,0x177433000) malloc: *** set a breakpoint in malloc_error_break to debug
```

## Root Cause Analysis

After investigating the code, I identified several issues:

1. **Parameter Conflicts**: The error log showed conflicts between `language` and `forced_decoder_ids` parameters when generating model outputs, causing warnings and potential memory issues.

2. **Missing Attention Mask**: The error indicated that the attention mask was not properly set, leading to unexpected behavior.

3. **Memory Management Issues**: The application did not properly clean up memory after processing chunks of audio, leading to heap corruption when multiple files were processed simultaneously.

4. **Resource Contention**: When processing multiple large audio files concurrently, the code did not limit the number of threads appropriately based on file count and size.

5. **Memory Leaks**: Audio data was not being properly freed, and PyTorch GPU memory was not being consistently cleared between operations.

## Implemented Fixes

1. **Improved Memory Management**:
   - Added comprehensive memory clearing functions that work for both CUDA (NVIDIA) and MPS (Apple Silicon) devices
   - Implemented explicit memory cleanup after processing each audio segment
   - Added garbage collection throughout the processing pipeline

2. **Fixed Parameter Conflicts**:
   - Resolved the conflict between `language` parameter and `forced_decoder_ids`
   - Added proper handling of attention masks to prevent warnings and undefined behavior

3. **Batched Processing**:
   - Changed the parallel processing approach to use smaller batches with memory cleanup between batches
   - Dynamically adjusted worker thread count based on the number of audio chunks

4. **Audio Data Handling**:
   - Added explicit copying of audio data to prevent memory corruption
   - Immediately freed audio data after it's no longer needed

5. **Error Resilience**:
   - Improved error handling with proper memory cleanup even when exceptions occur
   - Added more robust fallback mechanisms when model generation fails

## Technical Details

The core of the fix involved implementing a proper memory management system:

```python
def get_device_capabilities():
    """Determine available compute devices and their capabilities."""
    capabilities = {"cuda": False, "mps": False, "cpu": True}  # CPU is always available

    # Check CUDA (NVIDIA GPUs)
    try:
        capabilities["cuda"] = torch.cuda.is_available()
    except:
        pass

    # Check MPS (Apple Silicon)
    try:
        capabilities["mps"] = (
            hasattr(torch.backends, "mps") and torch.backends.mps.is_available()
        )
    except:
        pass

    return capabilities

def clear_memory(device_caps=None):
    """Clear device memory safely and efficiently for all device types."""
    if device_caps is None:
        device_caps = get_device_capabilities()

    try:
        # CUDA devices (NVIDIA GPUs)
        if device_caps["cuda"]:
            torch.cuda.empty_cache()
            torch.cuda.synchronize()
            logger.debug("CUDA memory cleared and synchronized")

        # MPS devices (Apple Silicon)
        elif device_caps["mps"]:
            if hasattr(torch.mps, "empty_cache"):
                torch.mps.empty_cache()
                logger.debug("MPS memory cleared")

        # Always run garbage collection regardless of device
        gc.collect()
        logger.debug("Garbage collection performed")
    except Exception as e:
        logger.warning(f"Error during memory clearing: {e}")
```

The parallel processing was updated to use batches with proper memory management:

```python
# Process chunks in batches to control memory usage
batch_size = min(4, adjusted_workers)  # Process chunks in small batches
processed_count = 0

while processed_count < len(chunks):
    logger.info(f"Processing batch of chunks {processed_count+1}-{min(processed_count+batch_size, len(chunks))} of {len(chunks)}")

    # Start a batch of chunk processing
    future_to_chunk = {}
    batch_end = min(processed_count + batch_size, len(chunks))

    # Process batch...

    # Clear memory after each batch to prevent memory buildup
    clear_memory()

    # Move to next batch
    processed_count = batch_end
```

Additionally, we fixed the attention mask and parameters conflict issues to prevent warnings that could lead to undefined behavior:

```python
# Check and fix potential conflicts with forced_decoder_ids
if hasattr(model.generation_config, "forced_decoder_ids") and model.generation_config.forced_decoder_ids is not None:
    logger.debug("Removing forced_decoder_ids to prevent conflict with language parameter")
    model.generation_config.forced_decoder_ids = None

# Add attention mask if missing to prevent attention mask warnings
if "attention_mask" not in inputs and hasattr(inputs, "input_features"):
    input_shape = inputs.input_features.shape
    attention_mask = torch.ones(
        (input_shape[0], input_shape[2]),
        dtype=torch.long,
        device=inputs.input_features.device
    )
    inputs["attention_mask"] = attention_mask
    logger.debug("Added attention mask to prevent warnings")
```

## Testing and Verification

The fix was tested by processing multiple large audio files in parallel to verify that the heap corruption issue was resolved. The memory consumption was closely monitored to ensure it remained stable.

## Additional Improvements

While fixing the memory issue, additional improvements were made:

1. Improved error handling throughout the transcription pipeline
2. Added more detailed logging for memory management operations
3. Made the code more resilient to different device types (CUDA, MPS, CPU)
4. Optimized batch sizes for different workloads

These changes should significantly improve the stability of the application when processing multiple audio files simultaneously.
