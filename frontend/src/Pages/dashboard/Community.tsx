import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { 
  Users, 
  MessageSquare, 
  Heart, 
  Share2, 
  User,
  Megaphone,
  Trophy,
  Star,
  Send
} from 'lucide-react';

const Community = () => {
  const [newPost, setNewPost] = useState('');

  const announcements = [
    {
      id: 1,
      title: 'Новый курс по JavaScript!',
      content: 'Скоро стартует курс по созданию интерактивных веб-сайтов. Записывайтесь!',
      date: '2 часа назад',
    },
    {
      id: 2,
      title: 'Хакатон PixelVerse 2024',
      content: 'Приглашаем всех учеников на наш первый хакатон! Создайте проект мечты за 48 часов.',
      date: '1 день назад',
    },
  ];

  const leaderboard = [
    { id: 1, name: 'Мария К.', points: 2850, level: 8, avatar: null },
    { id: 2, name: 'Дмитрий П.', points: 2640, level: 7, avatar: null },
    { id: 3, name: 'Алексей М.', points: 2510, level: 7, avatar: null },
    { id: 4, name: 'София Л.', points: 2320, level: 6, avatar: null },
    { id: 5, name: 'Артём В.', points: 2180, level: 6, avatar: null },
  ];

  const posts = [
    {
      id: 1,
      author: 'Мария К.',
      avatar: null,
      level: 8,
      content: 'Только что закончила свой первый платформер в Scratch! Потратила 2 недели, но результат того стоит 🎮',
      likes: 24,
      comments: 8,
      time: '3 часа назад',
      isLiked: false,
    },
    {
      id: 2,
      author: 'Дмитрий П.',
      avatar: null,
      level: 7,
      content: 'Кто-нибудь может помочь с циклами в Python? Не понимаю, как работает break 😅',
      likes: 5,
      comments: 12,
      time: '5 часов назад',
      isLiked: true,
    },
    {
      id: 3,
      author: 'София Л.',
      avatar: null,
      level: 6,
      content: 'Мой первый сайт на HTML готов! Спасибо Михаилу за отличные объяснения. Ссылка в профиле!',
      likes: 31,
      comments: 15,
      time: '1 день назад',
      isLiked: false,
    },
    {
      id: 4,
      author: 'Артём В.',
      avatar: null,
      level: 6,
      content: 'Начал изучать Python после Scratch. Сложнее, но интереснее! 🐍',
      likes: 18,
      comments: 6,
      time: '2 дня назад',
      isLiked: true,
    },
  ];

  return (
    <DashboardLayout title="Сообщество">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Create Post */}
          <Card variant="glow">
            <CardContent className="p-4">
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center shrink-0">
                  <User className="w-5 h-5 text-primary-foreground" />
                </div>
                <div className="flex-1">
                  <Textarea
                    placeholder="Поделитесь своими успехами или задайте вопрос..."
                    value={newPost}
                    onChange={(e) => setNewPost(e.target.value)}
                    className="mb-3 min-h-[80px]"
                  />
                  <div className="flex justify-end">
                    <Button variant="cosmic" disabled={!newPost.trim()}>
                      <Send className="w-4 h-4 mr-2" />
                      Опубликовать
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Posts Feed */}
          <div className="space-y-4">
            {posts.map((post) => (
              <Card key={post.id} variant="glass">
                <CardContent className="p-5">
                  {/* Author */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                      {post.avatar ? (
                        <img src={post.avatar} alt={post.author} className="w-full h-full rounded-full object-cover" />
                      ) : (
                        <User className="w-5 h-5 text-primary-foreground" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-foreground">{post.author}</span>
                        <Badge variant="outline" className="text-xs">
                          <Star className="w-3 h-3 mr-1 text-yellow-400" />
                          Ур. {post.level}
                        </Badge>
                      </div>
                      <span className="text-xs text-muted-foreground">{post.time}</span>
                    </div>
                  </div>

                  {/* Content */}
                  <p className="text-foreground mb-4 leading-relaxed">{post.content}</p>

                  {/* Actions */}
                  <div className="flex items-center gap-4 pt-3 border-t border-border/50">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className={post.isLiked ? 'text-red-400' : 'text-muted-foreground'}
                    >
                      <Heart className={`w-4 h-4 mr-1 ${post.isLiked ? 'fill-current' : ''}`} />
                      {post.likes}
                    </Button>
                    <Button variant="ghost" size="sm" className="text-muted-foreground">
                      <MessageSquare className="w-4 h-4 mr-1" />
                      {post.comments}
                    </Button>
                    <Button variant="ghost" size="sm" className="text-muted-foreground">
                      <Share2 className="w-4 h-4 mr-1" />
                      Поделиться
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Announcements */}
          <Card variant="glow">
            <CardHeader className="pb-3">
              <CardTitle className="font-display text-base flex items-center gap-2">
                <Megaphone className="w-5 h-5 text-primary" />
                Объявления
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {announcements.map((announcement) => (
                <div 
                  key={announcement.id}
                  className="p-3 rounded-xl bg-card/50 border border-border/50"
                >
                  <h4 className="font-bold text-sm text-foreground mb-1">
                    {announcement.title}
                  </h4>
                  <p className="text-xs text-muted-foreground mb-2">
                    {announcement.content}
                  </p>
                  <span className="text-xs text-muted-foreground/70">{announcement.date}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Leaderboard */}
          <Card variant="glass">
            <CardHeader className="pb-3">
              <CardTitle className="font-display text-base flex items-center gap-2">
                <Trophy className="w-5 h-5 text-yellow-400" />
                Лидеры недели
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {leaderboard.map((user, index) => (
                <div 
                  key={user.id}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-card/50 transition-colors"
                >
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    index === 0 ? 'bg-yellow-500 text-black' :
                    index === 1 ? 'bg-gray-400 text-black' :
                    index === 2 ? 'bg-orange-600 text-white' :
                    'bg-muted text-muted-foreground'
                  }`}>
                    {index + 1}
                  </div>
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                    {user.avatar ? (
                      <img src={user.avatar} alt={user.name} className="w-full h-full rounded-full object-cover" />
                    ) : (
                      <User className="w-4 h-4 text-primary-foreground" />
                    )}
                  </div>
                  <div className="flex-1">
                    <span className="font-medium text-sm text-foreground">{user.name}</span>
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 text-yellow-400" />
                      <span className="text-xs text-muted-foreground">Ур. {user.level}</span>
                    </div>
                  </div>
                  <span className="font-bold text-sm text-primary">{user.points}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Community Stats */}
          <Card variant="glass">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-secondary/20 flex items-center justify-center">
                  <Users className="w-6 h-6 text-secondary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">1,247</p>
                  <p className="text-sm text-muted-foreground">учеников в сообществе</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Community;
