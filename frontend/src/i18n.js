import i18n from "i18next";
import { initReactI18next } from "react-i18next";

i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: {
        navbar: {
          title: "PM Internship Scheme",
          login: "Login",
          register: "Register",
          language: "Language"
        },
        home: {
          heroTitle: "Empowering India's Youth",
          heroSub:
            "Providing real-world industry experience and financial support through structured internships.",
          eligibility: "Eligibility Criteria",
          benefits: "Benefits of PM Internship Scheme"
        }
      }
    },

    hi: {
      translation: {
        navbar: {
          title: "प्रधानमंत्री इंटर्नशिप योजना",
          login: "लॉगिन",
          register: "रजिस्टर",
          language: "भाषा"
        },
        home: {
          heroTitle: "भारत के युवाओं को सशक्त बनाना",
          heroSub:
            "संरचित इंटर्नशिप के माध्यम से उद्योग अनुभव और वित्तीय सहायता प्रदान करना।",
          eligibility: "पात्रता मानदंड",
          benefits: "योजना के लाभ"
        }
      }
    },

    gu: {
      translation: {
        navbar: {
          title: "પ્રધાનમંત્રી ઇન્ટર્નશિપ યોજના",
          login: "લૉગિન",
          register: "રજિસ્ટર",
          language: "ભાષા"
        },
        home: {
          heroTitle: "ભારતના યુવાનોને સશક્ત બનાવવું",
          heroSub:
            "રચનાત્મક ઇન્ટર્નશિપ દ્વારા ઉદ્યોગ અનુભવ અને આર્થિક સહાય પ્રદાન કરવી.",
          eligibility: "પાત્રતા માપદંડ",
          benefits: "યોજનાના લાભો"
        }
      }
    },

    pa: {
      translation: {
        navbar: {
          title: "ਪ੍ਰਧਾਨ ਮੰਤਰੀ ਇੰਟਰਨਸ਼ਿਪ ਯੋਜਨਾ",
          login: "ਲਾਗਇਨ",
          register: "ਰਜਿਸਟਰ",
          language: "ਭਾਸ਼ਾ"
        },
        home: {
          heroTitle: "ਭਾਰਤ ਦੇ ਨੌਜਵਾਨਾਂ ਨੂੰ ਸਸ਼ਕਤ ਬਣਾਉਣਾ",
          heroSub:
            "ਸੰਰਚਿਤ ਇੰਟਰਨਸ਼ਿਪ ਰਾਹੀਂ ਉਦਯੋਗੀ ਅਨੁਭਵ ਅਤੇ ਵਿੱਤੀ ਸਹਾਇਤਾ।",
          eligibility: "ਯੋਗਤਾ ਮਾਪਦੰਡ",
          benefits: "ਯੋਜਨਾ ਦੇ ਲਾਭ"
        }
      }
    },

    mr: {
      translation: {
        navbar: {
          title: "प्रधानमंत्री इंटर्नशिप योजना",
          login: "लॉगिन",
          register: "नोंदणी",
          language: "भाषा"
        },
        home: {
          heroTitle: "भारताच्या तरुणांना सक्षम करणे",
          heroSub:
            "संरचित इंटर्नशिपद्वारे उद्योग अनुभव आणि आर्थिक सहाय्य.",
          eligibility: "पात्रता निकष",
          benefits: "योजनेचे फायदे"
        }
      }
    }
  },
  lng: localStorage.getItem("lang") || "en",
  fallbackLng: "en",
  interpolation: { escapeValue: false }
});

export default i18n;