import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { ExternalLink } from "lucide-react";

const fetchTopStories = async () => {
  const response = await fetch(
    "https://hacker-news.firebaseio.com/v0/topstories.json"
  );
  const storyIds = await response.json();
  return Promise.all(
    storyIds.slice(0, 100).map(async (id) => {
      const storyResponse = await fetch(
        `https://hacker-news.firebaseio.com/v0/item/${id}.json`
      );
      return storyResponse.json();
    })
  );
};

const StoryItem = ({ story }) => (
  <div className="border-b py-4">
    <h3 className="text-lg font-semibold">{story.title}</h3>
    <div className="flex items-center justify-between mt-2">
      <span className="text-sm text-gray-500">{story.score} points</span>
      <a
        href={story.url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-500 hover:underline flex items-center"
      >
        Read more
        <ExternalLink className="ml-1 h-4 w-4" />
      </a>
    </div>
  </div>
);

const SkeletonStory = () => (
  <div className="border-b py-4">
    <Skeleton className="h-6 w-3/4 mb-2" />
    <div className="flex items-center justify-between mt-2">
      <Skeleton className="h-4 w-20" />
      <Skeleton className="h-4 w-24" />
    </div>
  </div>
);

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { data: stories, isLoading } = useQuery({
    queryKey: ["topStories"],
    queryFn: fetchTopStories,
  });

  const filteredStories = stories?.filter((story) =>
    story.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Hacker News Top Stories</h1>
      <Input
        type="text"
        placeholder="Search stories..."
        className="mb-6"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      {isLoading ? (
        Array.from({ length: 10 }).map((_, index) => (
          <SkeletonStory key={index} />
        ))
      ) : (
        <div>
          {filteredStories?.map((story) => (
            <StoryItem key={story.id} story={story} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Index;