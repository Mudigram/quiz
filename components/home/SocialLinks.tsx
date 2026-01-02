import { FaTwitter, FaDiscord, FaTelegram, FaGithub, FaMedium } from 'react-icons/fa';
import { ritualConfig } from '@/config/ritual';

const socialPlatforms = [
    { name: 'Twitter', icon: FaTwitter, url: ritualConfig.socials.twitter, color: 'hover:text-brand-blue' },
    { name: 'Discord', icon: FaDiscord, url: ritualConfig.socials.discord, color: 'hover:text-brand-purple' },
    { name: 'Telegram', icon: FaTelegram, url: ritualConfig.socials.telegram, color: 'hover:text-brand-blue' },
    { name: 'GitHub', icon: FaGithub, url: ritualConfig.socials.github, color: 'hover:text-brand-black dark:hover:text-brand-white' },
    { name: 'Medium', icon: FaMedium, url: ritualConfig.socials.medium, color: 'hover:text-brand-green' },
];

export function SocialLinks() {
    return (
        <div className="card slide-up">
            <h3 className="text-sm font-black text-brand-black/60 dark:text-brand-white/60 mb-4 uppercase tracking-widest text-center">
                Connect with Ritual
            </h3>
            <div className="flex justify-center items-center gap-6 flex-wrap">
                {socialPlatforms.map(({ name, icon: Icon, url, color }) => (
                    <a
                        key={name}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`text-brand-black/40 dark:text-brand-white/40 ${color} transition-all transform hover:scale-110`}
                        aria-label={name}
                    >
                        <Icon className="w-8 h-8" />
                    </a>
                ))}
            </div>
        </div>
    );
}
