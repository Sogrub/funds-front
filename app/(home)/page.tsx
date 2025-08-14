"use client";

// Components
import { Content } from "./components/content";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient()

const HomePage: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Content />
    </QueryClientProvider>
  )
};

export default HomePage;
