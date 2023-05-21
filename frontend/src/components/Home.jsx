import React from "react";
import Container from "./Container";
import HeroSlideshow from "./user/HeroSlideshow";
import NotVerified from "./user/NotVerified";
import TopRatedMovies from "./user/TopRatedMovies";
import TopRatedTVSeries from "./user/TopRatedTVSeries";

export default function Home() {
  return (
    <div className="dark:bg-primary bg-custom-gray min-h-screen">
      <Container className="px-2 xl:p-0">
        <NotVerified />
        <HeroSlideshow />
        <div className="space-y-3 py-8">
          <TopRatedMovies />
          <TopRatedTVSeries />
        </div>
      </Container>
    </div>
  );
}
