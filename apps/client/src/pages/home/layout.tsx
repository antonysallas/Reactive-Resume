// home-layout.tsx
import { ScrollArea } from "@reactive-resume/ui";
import { Outlet } from "react-router-dom";

import { Footer } from "./components/footer";
import { Header } from "./components/header";
import { useAuthProviders } from "@/client/services/auth/providers";

export const HomeLayout = () => {
  const { providers, loading, error } = useAuthProviders();

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading providers</p>;

  // Ensure providers is an instance of AuthProvidersDto
  if (!providers?.providers || providers.providers.length === 0) return null;

  return (
    <ScrollArea orientation="vertical" className="h-screen">
      <Header />
      <Outlet />
      <Footer />
    </ScrollArea>
  );
};
