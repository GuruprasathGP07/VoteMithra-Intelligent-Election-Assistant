import { useTranslation } from 'react-i18next';

const Footer = () => {
  const { t } = useTranslation();
  return (
    <footer className="bg-blue-main text-white py-12 px-8">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="material-icons">how_to_vote</span>
            <span className="font-playfair text-xl font-bold">VoteMitra</span>
          </div>
          <p className="text-xs opacity-70 leading-relaxed">
            {t('footer.text')} – VoteMitra is an independent educational platform. All information is sourced from official ECI guidelines.
          </p>
        </div>
        
        <div>
          <h4 className="font-bold mb-4 uppercase tracking-widest text-xs opacity-50">Legal Links</h4>
          <ul className="text-sm space-y-2">
            <li><a href="https://voters.eci.gov.in" target="_blank" className="hover:underline">ECI Voter Portal</a></li>
            <li><a href="https://eci.gov.in" target="_blank" className="hover:underline">Election Commission of India</a></li>
            <li><a href="#" className="hover:underline">Privacy Policy</a></li>
            <li><a href="#" className="hover:underline">Terms of Use</a></li>
          </ul>
        </div>

        <div>
            <h4 className="font-bold mb-4 uppercase tracking-widest text-xs opacity-50">Social & Contact</h4>
            <div className="flex gap-4">
                {['facebook', 'twitter', 'youtube', 'language'].map(icon => (
                    <span key={icon} className="material-icons cursor-pointer hover:text-saffron transition-colors">{icon}</span>
                ))}
            </div>
            <p className="text-xs mt-4 opacity-70">Support: contact@votemitra.in</p>
        </div>
      </div>
      <div className="max-w-6xl mx-auto mt-12 pt-8 border-t border-white/10 text-center text-[10px] opacity-40">
        &copy; {new Date().getFullYear()} VoteMitra – Built with Google Gemini & Firebase.
      </div>
    </footer>
  );
};

export default Footer;
