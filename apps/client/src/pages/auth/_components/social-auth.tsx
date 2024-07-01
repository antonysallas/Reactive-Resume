// social-auth.tsx
import { t } from "@lingui/macro";
import { GithubLogo, GoogleLogo } from "@phosphor-icons/react";
import { Button } from "@reactive-resume/ui";

import { useAuthProviders } from "@/client/services/auth/providers";

export const SocialAuth = () => {
  const { providers, loading, error } = useAuthProviders();

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading providers</p>;

  // Ensure providers is an instance of AuthProvidersDto
  if (!providers?.providers || providers.providers.length === 0) return null;

  return (
    <div className="grid grid-cols-2 gap-4">
      {providers.providers.includes("github") && (
        <Button asChild size="lg" className="w-full !bg-[#222] !text-white hover:!bg-[#222]/80">
          <a href="/api/auth/github">
            <GithubLogo className="mr-3 size-4" />
            {t`GitHub`}
          </a>
        </Button>
      )}

      {providers.providers.includes("google") && (
        <Button
          asChild
          size="lg"
          className="w-full !bg-[#4285F4] !text-white hover:!bg-[#4285F4]/80"
        >
          <a href="/api/auth/google">
            <GoogleLogo className="mr-3 size-4" />
            {t`Google`}
          </a>
        </Button>
      )}
    </div>
  );
};
