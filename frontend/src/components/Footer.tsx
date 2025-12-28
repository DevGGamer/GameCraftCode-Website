import { Link } from 'react-router-dom';
import { Rocket, Mail, Phone, MapPin, MessageCircle } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-muted/30 border-t border-border/50 pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <Rocket className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-display font-bold text-foreground">
                PixelVerse
              </span>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Онлайн-школа программирования для детей 8–17 лет. 
              Открываем мир технологий через игру и творчество.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="font-display font-bold text-foreground mb-4">Навигация</h4>
            <ul className="space-y-2">
              {['О школе', 'Программы', 'Проекты', 'Тарифы', 'Отзывы'].map((item) => (
                <li key={item}>
                  <a 
                    href={`#${item.toLowerCase()}`}
                    className="text-muted-foreground hover:text-foreground transition-colors text-sm"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Programs */}
          <div>
            <h4 className="font-display font-bold text-foreground mb-4">Программы</h4>
            <ul className="space-y-2">
              {['Scratch', 'Python', 'Веб-разработка', 'Unity', 'Мобильные приложения'].map((item) => (
                <li key={item}>
                  <span className="text-muted-foreground text-sm">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contacts */}
          <div>
            <h4 className="font-display font-bold text-foreground mb-4">Контакты</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-muted-foreground text-sm">
                <Phone className="w-4 h-4 text-primary" />
                +7 (800) 123-45-67
              </li>
              <li className="flex items-center gap-3 text-muted-foreground text-sm">
                <Mail className="w-4 h-4 text-primary" />
                hello@pixelverse.ru
              </li>
              <li className="flex items-center gap-3 text-muted-foreground text-sm">
                <MessageCircle className="w-4 h-4 text-primary" />
                @pixelverse_school
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-border/50 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © {currentYear} PixelVerse. Все права защищены.
          </p>
          <div className="flex items-center gap-6">
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Политика конфиденциальности
            </a>
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Публичная оферта
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
