import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

const GamificationPage = () => {
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState('dashboard');

  const userStats = {
    level: 15,
    points: 2450,
    nextLevel: 2800,
    safetyScore: 92,
    streak: 12,
    rank: 3
  };

  const badges = [
    { id: 1, name: 'Safety Champion', icon: '🏆', earned: true, description: '30 days accident-free' },
    { id: 2, name: 'Helmet Hero', icon: '⛑️', earned: true, description: '100% helmet compliance' },
    { id: 3, name: 'Speed Demon Tamed', icon: '🚦', earned: true, description: 'No speed violations for 14 days' },
    { id: 4, name: 'Smooth Operator', icon: '🎯', earned: false, description: 'Maintain steady acceleration' },
    { id: 5, name: 'Weather Warrior', icon: '🌧️', earned: false, description: 'Ride safely in adverse weather' },
    { id: 6, name: 'Eco Rider', icon: '🌱', earned: true, description: 'Efficient fuel consumption' }
  ];

  const leaderboard = [
    { rank: 1, name: 'Alex Johnson', points: 3200, streak: 18, badge: '🥇' },
    { rank: 2, name: 'Sarah Chen', points: 2890, streak: 15, badge: '🥈' },
    { rank: 3, name: 'You', points: 2450, streak: 12, badge: '🥉' },
    { rank: 4, name: 'Mike Wilson', points: 2340, streak: 10, badge: '' },
    { rank: 5, name: 'Emma Davis', points: 2180, streak: 8, badge: '' }
  ];

  const challenges = [
    { id: 1, name: 'Perfect Week', target: 7, current: 5, reward: 200, type: 'streak' },
    { id: 2, name: 'Helmet Master', target: 100, current: 95, reward: 150, type: 'percentage' },
    { id: 3, name: 'Smooth Rider', target: 50, current: 32, reward: 300, type: 'count' },
    { id: 4, name: 'Early Bird', target: 10, current: 7, reward: 100, type: 'morning_rides' }
  ];

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={() => navigate('/dashboard/org')}>
              ← Back to Dashboard
            </Button>
            <h1 className="text-2xl font-bold">Gamification & Safe-Riding Rewards</h1>
          </div>
        </div>
      </header>

      {/* Tab Navigation */}
      <div className="border-b border-border">
        <div className="container">
          <div className="flex space-x-8">
            {[
              { id: 'dashboard', label: '🎮 Dashboard' },
              { id: 'badges', label: '🏆 Badges' },
              { id: 'leaderboard', label: '📊 Leaderboard' },
              { id: 'challenges', label: '🎯 Challenges' }
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
        {selectedTab === 'dashboard' && (
          <>
            {/* User Stats Overview */}
            <div className="grid md:grid-cols-4 gap-6 mb-8">
              <Card className="sensor-card">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Level</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-primary">{userStats.level}</div>
                  <Progress value={(userStats.points / userStats.nextLevel) * 100} className="mt-2" />
                  <div className="text-sm text-muted-foreground mt-1">
                    {userStats.nextLevel - userStats.points} to next level
                  </div>
                </CardContent>
              </Card>

              <Card className="sensor-card">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Safety Score</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-400">{userStats.safetyScore}</div>
                  <Progress value={userStats.safetyScore} className="mt-2" />
                  <div className="text-sm text-muted-foreground mt-1">Excellent rating</div>
                </CardContent>
              </Card>

              <Card className="sensor-card">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Safe Days Streak</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-yellow-400">{userStats.streak} 🔥</div>
                  <div className="text-sm text-muted-foreground mt-1">
                    Personal best: 18 days
                  </div>
                </CardContent>
              </Card>

              <Card className="sensor-card">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Fleet Rank</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-purple-400">#{userStats.rank}</div>
                  <div className="text-sm text-muted-foreground mt-1">
                    Out of 50 riders
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Achievements */}
            <Card className="sensor-card mb-8">
              <CardHeader>
                <CardTitle>🎉 Recent Achievements</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 p-3 bg-green-500/20 rounded-lg border border-green-500/30">
                    <div className="text-2xl">🏆</div>
                    <div>
                      <p className="font-medium text-green-400">Safety Champion Badge Earned!</p>
                      <p className="text-sm text-muted-foreground">30 consecutive days without incidents</p>
                    </div>
                    <Badge className="status-safe">+200 pts</Badge>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-blue-500/20 rounded-lg border border-blue-500/30">
                    <div className="text-2xl">⛑️</div>
                    <div>
                      <p className="font-medium text-blue-400">Helmet Hero Level 2</p>
                      <p className="text-sm text-muted-foreground">100% helmet compliance for 2 weeks</p>
                    </div>
                    <Badge className="status-safe">+150 pts</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {selectedTab === 'badges' && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {badges.map((badge) => (
              <Card key={badge.id} className={`sensor-card ${badge.earned ? 'border-primary/50' : 'opacity-60'}`}>
                <CardContent className="pt-6 text-center">
                  <div className="text-4xl mb-3">{badge.icon}</div>
                  <h3 className="font-bold mb-2">{badge.name}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{badge.description}</p>
                  <Badge className={badge.earned ? 'status-safe' : 'status-neutral'}>
                    {badge.earned ? 'Earned' : 'Locked'}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {selectedTab === 'leaderboard' && (
          <Card className="sensor-card">
            <CardHeader>
              <CardTitle>🏁 Fleet Leaderboard</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {leaderboard.map((rider) => (
                  <div
                    key={rider.rank}
                    className={`flex items-center justify-between p-4 rounded-lg ${
                      rider.name === 'You' ? 'bg-primary/20 border border-primary/30' : 'bg-muted'
                    }`}
                  >
                    <div className="flex items-center space-x-4">
                      <div className="text-2xl">{rider.badge || `#${rider.rank}`}</div>
                      <div>
                        <p className="font-medium">{rider.name}</p>
                        <p className="text-sm text-muted-foreground">{rider.streak} day streak</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold">{rider.points}</div>
                      <div className="text-sm text-muted-foreground">points</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {selectedTab === 'challenges' && (
          <div className="grid md:grid-cols-2 gap-6">
            {challenges.map((challenge) => (
              <Card key={challenge.id} className="sensor-card">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    {challenge.name}
                    <Badge variant="secondary">+{challenge.reward} pts</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>{challenge.current}/{challenge.target}</span>
                    </div>
                    <Progress value={(challenge.current / challenge.target) * 100} />
                    <div className="text-sm text-muted-foreground">
                      {challenge.target - challenge.current} more to complete
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default GamificationPage;