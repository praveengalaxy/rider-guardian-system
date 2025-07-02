import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';

const CommunityPage = () => {
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState('feed');
  const [newPost, setNewPost] = useState('');

  const posts = [
    {
      id: 1,
      author: 'Alex Johnson',
      avatar: '👨‍💼',
      time: '2 hours ago',
      content: 'Just completed a 50km ride with zero safety violations! The AR navigation really helped keep my eyes on the road. 🏆',
      stats: { distance: '50km', duration: '2h 15m', safetyScore: 98 },
      likes: 12,
      comments: 3,
      badges: ['Safety Champion', 'Distance Hero']
    },
    {
      id: 2,
      author: 'Sarah Chen',
      avatar: '👩‍💼',
      time: '4 hours ago',
      content: 'Sharing my favorite route through the city center. Perfect balance of efficiency and scenic views! Anyone want to join next week?',
      route: 'Downtown Loop',
      stats: { distance: '25km', avgSpeed: '35km/h', traffic: 'Light' },
      likes: 8,
      comments: 5,
      badges: ['Route Explorer']
    },
    {
      id: 3,
      author: 'Mike Wilson',
      avatar: '👨‍🔧',
      time: '1 day ago',
      content: 'PSA: Remember to check tire pressure regularly! My predictive maintenance alert saved me from a potential blowout.',
      tips: ['Check pressure weekly', 'Monitor tread depth', 'Rotate tires every 5000km'],
      likes: 15,
      comments: 7,
      badges: ['Maintenance Master']
    }
  ];

  const routes = [
    { id: 1, name: 'Scenic Harbor Route', distance: '30km', difficulty: 'Easy', rating: 4.8, shared: 23 },
    { id: 2, name: 'Mountain Challenge', distance: '45km', difficulty: 'Hard', rating: 4.9, shared: 8 },
    { id: 3, name: 'City Express', distance: '20km', difficulty: 'Medium', rating: 4.6, shared: 45 },
    { id: 4, name: 'Coastal Cruise', distance: '35km', difficulty: 'Easy', rating: 4.7, shared: 31 }
  ];

  const challenges = [
    { id: 1, name: 'Team Safety Week', participants: 28, goal: 'Zero violations for 7 days', reward: '500 pts', deadline: '3 days left' },
    { id: 2, name: 'Eco Efficiency Challenge', participants: 15, goal: 'Best fuel economy', reward: '750 pts', deadline: '1 week left' },
    { id: 3, name: 'Distance Masters', participants: 42, goal: '1000km total distance', reward: '1000 pts', deadline: '2 weeks left' }
  ];

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={() => navigate('/dashboard/org')}>
              ← Back to Dashboard
            </Button>
            <h1 className="text-2xl font-bold">Rider Community & Social Hub</h1>
          </div>
        </div>
      </header>

      {/* Tab Navigation */}
      <div className="border-b border-border">
        <div className="container">
          <div className="flex space-x-8">
            {[
              { id: 'feed', label: '📱 Social Feed' },
              { id: 'routes', label: '🗺️ Shared Routes' },
              { id: 'challenges', label: '🏁 Group Challenges' },
              { id: 'safety', label: '🛡️ Safety Tips' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedTab(tab.id)}
                className={`py-4 px-2 border-b-2 font-medium text-sm ${
                  selectedTab === tab.id
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="container py-8">
        {selectedTab === 'feed' && (
          <>
            {/* Create Post */}
            <Card className="sensor-card mb-8">
              <CardHeader>
                <CardTitle>Share Your Ride</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder="Share your latest ride, safety tip, or achievement..."
                  value={newPost}
                  onChange={(e) => setNewPost(e.target.value)}
                  className="min-h-[100px]"
                />
                <div className="flex gap-3">
                  <Button variant="hero">Post Update</Button>
                  <Button variant="outline">Add Route</Button>
                  <Button variant="outline">Share Stats</Button>
                </div>
              </CardContent>
            </Card>

            {/* Social Feed */}
            <div className="space-y-6">
              {posts.map((post) => (
                <Card key={post.id} className="sensor-card">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="text-2xl">{post.avatar}</div>
                        <div>
                          <p className="font-medium">{post.author}</p>
                          <p className="text-sm text-muted-foreground">{post.time}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {post.badges?.map((badge, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {badge}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-4">{post.content}</p>
                    
                    {post.stats && (
                      <div className="grid grid-cols-3 gap-4 p-3 bg-muted rounded-lg mb-4">
                        {Object.entries(post.stats).map(([key, value]) => (
                          <div key={key} className="text-center">
                            <div className="font-bold">{value}</div>
                            <div className="text-xs text-muted-foreground capitalize">{key.replace(/([A-Z])/g, ' $1')}</div>
                          </div>
                        ))}
                      </div>
                    )}

                    {post.tips && (
                      <div className="p-3 bg-blue-500/20 rounded-lg mb-4 border border-blue-500/30">
                        <p className="font-medium text-blue-400 mb-2">💡 Safety Tips:</p>
                        <ul className="text-sm space-y-1">
                          {post.tips.map((tip, index) => (
                            <li key={index}>• {tip}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <button className="hover:text-primary">👍 {post.likes}</button>
                      <button className="hover:text-primary">💬 {post.comments}</button>
                      <button className="hover:text-primary">🔄 Share</button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}

        {selectedTab === 'routes' && (
          <div className="grid md:grid-cols-2 gap-6">
            {routes.map((route) => (
              <Card key={route.id} className="sensor-card">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    {route.name}
                    <Badge className={
                      route.difficulty === 'Easy' ? 'status-safe' :
                      route.difficulty === 'Medium' ? 'status-warning' : 'status-danger'
                    }>
                      {route.difficulty}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Distance:</span>
                      <span className="font-medium">{route.distance}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Rating:</span>
                      <span className="font-medium">⭐ {route.rating}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Shared by:</span>
                      <span className="font-medium">{route.shared} riders</span>
                    </div>
                    <div className="bg-muted rounded h-24 flex items-center justify-center text-muted-foreground">
                      🗺️ Route Preview
                    </div>
                    <div className="flex gap-2">
                      <Button variant="hero" size="sm">Navigate</Button>
                      <Button variant="outline" size="sm">Save Route</Button>
                      <Button variant="outline" size="sm">Share</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {selectedTab === 'challenges' && (
          <div className="space-y-6">
            {challenges.map((challenge) => (
              <Card key={challenge.id} className="sensor-card">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    {challenge.name}
                    <Badge variant="secondary">{challenge.reward}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Goal</p>
                      <p className="font-medium">{challenge.goal}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Participants</p>
                      <p className="font-medium">{challenge.participants} riders</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Deadline</p>
                      <p className="font-medium text-yellow-400">{challenge.deadline}</p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <Button variant="hero">Join Challenge</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {selectedTab === 'safety' && (
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="sensor-card">
              <CardHeader>
                <CardTitle>🏆 Top Safety Tips from Champions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-3 bg-green-500/20 rounded-lg border border-green-500/30">
                    <p className="font-medium text-green-400">Pre-ride Checklist</p>
                    <ul className="text-sm mt-2 space-y-1">
                      <li>• Check tire pressure and tread</li>
                      <li>• Test brakes and lights</li>
                      <li>• Ensure helmet fits properly</li>
                      <li>• Check weather conditions</li>
                    </ul>
                  </div>
                  <div className="p-3 bg-blue-500/20 rounded-lg border border-blue-500/30">
                    <p className="font-medium text-blue-400">Defensive Riding</p>
                    <ul className="text-sm mt-2 space-y-1">
                      <li>• Maintain safe following distance</li>
                      <li>• Be visible - use lights and reflectors</li>
                      <li>• Scan for hazards constantly</li>
                      <li>• Never assume others see you</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="sensor-card">
              <CardHeader>
                <CardTitle>📊 Community Safety Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-400">97.2%</div>
                    <div className="text-sm text-muted-foreground">Fleet Safety Score</div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <div className="text-xl font-bold">15</div>
                      <div className="text-xs text-muted-foreground">Days without incident</div>
                    </div>
                    <div>
                      <div className="text-xl font-bold">98.5%</div>
                      <div className="text-xs text-muted-foreground">Helmet compliance</div>
                    </div>
                  </div>
                  <div className="p-3 bg-yellow-500/20 rounded-lg border border-yellow-500/30">
                    <p className="font-medium text-yellow-400">Weekly Goal</p>
                    <p className="text-sm">Zero safety violations - 3 days to go!</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommunityPage;