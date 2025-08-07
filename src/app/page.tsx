'use client';

import Button from "@/components/child-friendly/Button";
import { StoryCard } from "@/components/child-friendly/Card";

export default function HomePage() {
  return (
    <div className="container-child py-8">
      {/* Hero Section */}
      <section className="text-center mb-12">
        <div className="mb-6">
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">
            Welcome to StoryForge! 
            <span className="ml-2" role="img" aria-label="Magic wand">✨</span>
          </h1>
          <p className="text-xl md:text-2xl text-foreground-secondary max-w-3xl mx-auto leading-relaxed">
            Create amazing adventures with AI magic! 
            <span className="ml-2" role="img" aria-label="Books">📚</span>
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-2xl mx-auto">
          <Button 
            variant="primary" 
            size="large" 
            ageGroup="7-10"
            icon={<span role="img" aria-label="Create">✨</span>}
          >
            Start Creating!
          </Button>
          <Button 
            variant="secondary" 
            size="large" 
            ageGroup="7-10"
            icon={<span role="img" aria-label="Read">📖</span>}
          >
            Read Stories
          </Button>
          <Button 
            variant="fun" 
            size="large" 
            ageGroup="7-10"
            icon={<span role="img" aria-label="Character">👤</span>}
          >
            Make Characters
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-primary text-center mb-8">
          What Can You Do? 
          <span className="ml-2" role="img" aria-label="Question">🤔</span>
        </h2>
        
        <div className="grid-child">
          <div className="card-child text-center">
            <div className="text-6xl mb-4" role="img" aria-label="Story">📝</div>
            <h3 className="text-xl font-bold text-primary mb-3">Write Stories</h3>
            <p className="text-foreground-secondary">
              Create awesome adventures with help from AI! Make stories about anything you can imagine!
            </p>
          </div>
          
          <div className="card-child text-center">
            <div className="text-6xl mb-4" role="img" aria-label="Pictures">🎨</div>
            <h3 className="text-xl font-bold text-primary mb-3">Make Pictures</h3>
            <p className="text-foreground-secondary">
              AI will draw pictures for your stories! Watch your characters and places come to life!
            </p>
          </div>
          
          <div className="card-child text-center">
            <div className="text-6xl mb-4" role="img" aria-label="Friends">👥</div>
            <h3 className="text-xl font-bold text-primary mb-3">Share Safely</h3>
            <p className="text-foreground-secondary">
              Share your stories with friends! Parents can help you decide what to share.
            </p>
          </div>
          
          <div className="card-child text-center">
            <div className="text-6xl mb-4" role="img" aria-label="Learning">🎓</div>
            <h3 className="text-xl font-bold text-primary mb-3">Learn & Grow</h3>
            <p className="text-foreground-secondary">
              Get better at writing and storytelling! Earn cool badges for your achievements!
            </p>
          </div>
        </div>
      </section>

      {/* Sample Stories Section */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-primary text-center mb-8">
          Check Out These Cool Stories! 
          <span className="ml-2" role="img" aria-label="Star">⭐</span>
        </h2>
        
        <div className="grid-child">
          <StoryCard
            ageGroup="7-10"
            title="The Magic Forest Adventure"
            description="Join Emma as she discovers a hidden forest full of talking animals and magical surprises! What will she find next?"
            author="Alex, age 9"
            readTime="5 min"
            difficulty="Easy"
            tags={["Adventure", "Magic", "Animals"]}
            onRead={() => console.log('Reading story...')}
            onFavorite={() => console.log('Added to favorites!')}
          />
          
          <StoryCard
            ageGroup="7-10"
            title="Mystery of the Missing Cookies"
            description="Someone took all the cookies from the kitchen! Help Detective Sam solve this yummy mystery before dinner time!"
            author="Maya, age 10"
            readTime="8 min"
            difficulty="Medium"
            tags={["Mystery", "Detective", "Funny"]}
            onRead={() => console.log('Reading story...')}
            onFavorite={() => console.log('Added to favorites!')}
          />
          
          <StoryCard
            ageGroup="7-10"
            title="Space Dragon Rescue"
            description="Captain Zoe must save friendly dragons from the mean space pirates! An epic adventure among the stars awaits!"
            author="Jordan, age 11"
            readTime="12 min"
            difficulty="Medium"
            tags={["Space", "Dragons", "Heroes"]}
            onRead={() => console.log('Reading story...')}
            onFavorite={() => console.log('Added to favorites!')}
          />
        </div>
      </section>

      {/* Safety Message */}
      <section className="bg-background-secondary rounded-2xl p-8 text-center">
        <div className="text-4xl mb-4" role="img" aria-label="Shield">🛡️</div>
        <h2 className="text-2xl font-bold text-primary mb-4">Safe & Fun for Everyone!</h2>
        <p className="text-lg text-foreground-secondary max-w-2xl mx-auto leading-relaxed">
          StoryForge is super safe! Our AI only creates nice, fun stories. 
          Your parents can see everything you make, and we never share your information with strangers.
        </p>
        <div className="mt-6">
          <Button 
            variant="warning" 
            size="medium" 
            ageGroup="7-10"
            icon={<span role="img" aria-label="Parents">👨‍👩‍👧‍👦</span>}
          >
            Parent Info
          </Button>
        </div>
      </section>
    </div>
  );
}