import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Volume2, X, Send, Sparkles } from 'lucide-react';
import { useAccessibility } from '../context/AccessibilityContext';
import api from '../services/api';

const VoiceAssistantModal = ({ isOpen, onClose, onRefreshData }) => {
  const { language, speak, getSpeechLangCode, t } = useAccessibility();
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [assistantResponse, setAssistantResponse] = useState('');
  const [supported, setSupported] = useState(true);
  const [textQuery, setTextQuery] = useState('');

  useEffect(() => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      setSupported(false);
    }
  }, []);

  const handleCommand = async (commandText) => {
    const text = commandText.toLowerCase().trim();
    setTranscript(commandText);

    try {
      if (
        text.includes('medicine') ||
        text.includes('today') ||
        text.includes('schedule') ||
        text.includes('மருந்து') ||
        text.includes('दवा') ||
        text.includes('మందు') ||
        text.includes('ಔಷಧ') ||
        text.includes('മരുന്ന്')
      ) {
        // Fetch today's medicines
        const res = await api.get('/medication-logs/today');
        if (res.data.success && res.data.data.length > 0) {
          const count = res.data.data.length;
          const pending = res.data.data.filter((m) => m.status === 'pending');

          let reply = `You have ${count} medication doses scheduled for today. ${pending.length} are currently pending.`;
          if (language === 'ta') {
            reply = `இன்று உங்களிடம் ${count} மருந்துகள் உள்ளன. இன்னும் ${pending.length} மருந்துகள் எடுக்கப்பட வேண்டும்.`;
          } else if (language === 'hi') {
            reply = `आज आपके पास ${count} निर्धारित खुराकें हैं। ${pending.length} अभी लंबित हैं।`;
          } else if (language === 'te') {
            reply = `నేడు మీకు ${count} మందుల మోతాదులు ఉన్నాయి. ${pending.length} ఇంకా వేచి ఉన్నాయి.`;
          } else if (language === 'kn') {
            reply = `ಇಂದು ನಿಮಗೆ ${count} ಔಷಧಿ ಪ್ರಮಾಣಗಳಿವೆ. ${pending.length} ಇನ್ನೂ ಬಾಕಿ ಇವೆ.`;
          } else if (language === 'ml') {
            reply = `ഇന്ന് നിങ്ങൾക്ക് ${count} മരുന്നുകൾ നിശ്ചയിച്ചിട്ടുണ്ട്. ${pending.length} എണ്ണം ബാക്കിയുണ്ട്.`;
          }

          setAssistantResponse(reply);
          speak(reply);
        } else {
          let reply = 'You have no medication doses scheduled for today.';
          if (language === 'ta') {
            reply = 'இன்று உங்களுக்கு எந்த மருந்துகளும் திட்டமிடப்படவில்லை.';
          } else if (language === 'hi') {
            reply = 'आज आपके लिए कोई दवा निर्धारित नहीं है।';
          } else if (language === 'te') {
            reply = 'నేడు మీకు ఎలాంటి మందులు షెడ్యూల్ చేయబడలేదు.';
          } else if (language === 'kn') {
            reply = 'ಇಂದು ನಿಮಗೆ ಯಾವುದೇ ಔಷಧಿ ನಿಗದಿಯಾಗಿಲ್ಲ.';
          } else if (language === 'ml') {
            reply = 'ഇന്ന് നിങ്ങൾക്ക് കഴിക്കേണ്ട മരുന്നുകൾ ഒന്നുമില്ല.';
          }
          setAssistantResponse(reply);
          speak(reply);
        }
      } else if (
        text.includes('appointment') ||
        text.includes('doctor') ||
        text.includes('சந்திப்பு') ||
        text.includes('மருத்துவர்') ||
        text.includes('डॉक्टर') ||
        text.includes('अपॉइंटमेंट') ||
        text.includes('డాక్టర్') ||
        text.includes('ಅಪಾಯಿಂಟ್ಮೆಂಟ್') ||
        text.includes('കൂടിക്കാഴ്ച')
      ) {
        // Fetch appointments
        const res = await api.get('/appointments');
        if (res.data.success && res.data.data.length > 0) {
          const next = res.data.data[0];
          let reply = `Your next appointment is with Dr. ${next.doctorName} on ${next.date} at ${next.time} at ${next.hospitalOrClinic}.`;
          if (language === 'ta') {
            reply = `உங்கள் அடுத்த சந்திப்பு மருத்துவர் ${next.doctorName} உடன் ${next.date} அன்று ${next.time} மணிக்கு ${next.hospitalOrClinic} மருத்துவமனையில் உள்ளது.`;
          } else if (language === 'hi') {
            reply = `आपकी अगली अपॉइंटमेंट डॉक्टर ${next.doctorName} के साथ ${next.date} को ${next.time} बजे ${next.hospitalOrClinic} में है।`;
          } else if (language === 'te') {
            reply = `మీ తదుపరి అపాయింట్‌మెంట్ డాక్టర్ ${next.doctorName} గారితో ${next.date} తేదీన ${next.time} గంటలకు ${next.hospitalOrClinic} వద్ద ఉంది.`;
          } else if (language === 'kn') {
            reply = `ನಿಮ್ಮ ಮುಂದಿನ ಭೇಟಿ ಡಾ. ${next.doctorName} ಅವರೊಂದಿಗೆ ${next.date} ರಂದು ${next.time} ಕ್ಕೆ ${next.hospitalOrClinic} ನಲ್ಲಿದೆ.`;
          } else if (language === 'ml') {
            reply = `നിങ്ങളുടെ അടുത്ത കൂടിക്കാഴ്ച ഡോക്ടർ ${next.doctorName}-മായി ${next.date}-ന് ${next.time}-ൽ ${next.hospitalOrClinic}-ൽ ആണ്.`;
          }

          setAssistantResponse(reply);
          speak(reply);
        } else {
          let reply = 'You have no upcoming doctor appointments scheduled.';
          if (language === 'ta') {
            reply = 'உங்களுக்கு வரவிருக்கும் மருத்துவர் சந்திப்புகள் எதுவும் இல்லை.';
          } else if (language === 'hi') {
            reply = 'आपकी कोई आगामी डॉक्टर अपॉइंटमेंट नहीं है।';
          } else if (language === 'te') {
            reply = 'రాబోయే డాక్టర్ అపాయింట్‌మెంట్లు ఏవీ లేవు.';
          } else if (language === 'kn') {
            reply = 'ಯಾವುದೇ ಮುಂಬರುವ ವೈದ್ಯರ ಭೇಟಿಗಳು ನಿಗದಿಯಾಗಿಲ್ಲ.';
          } else if (language === 'ml') {
            reply = 'വരാനിരിക്കുന്ന ഡോക്ടർ കൂടിക്കാഴ്ചകൾ ഒന്നുമില്ല.';
          }
          setAssistantResponse(reply);
          speak(reply);
        }
      } else {
        let reply = "I can help with your daily medications, today's schedule, or doctor appointments. Ask 'What medicines should I take today?'";
        if (language === 'ta') {
          reply = 'நான் உங்கள் மருந்து அட்டவணை மற்றும் மருத்துவ சந்திப்புகளைப் பற்றி உதவ முடியும்.';
        } else if (language === 'hi') {
          reply = 'मैं आपकी दैनिक दवाओं और डॉक्टर अपॉइंटमेंट में सहायता कर सकता हूँ।';
        } else if (language === 'te') {
          reply = 'నేను మీ రోజువారీ మందులు మరియు డాక్టర్ అపాయింట్‌మెంట్లలో సహాయం చేయగలను.';
        } else if (language === 'kn') {
          reply = 'ನಾನು ನಿಮ್ಮ ದೈನಂದಿನ ಔಷಧಿಗಳು ಮತ್ತು ವೈದ್ಯರ ಭೇಟಿಗಳ ಬಗ್ಗೆ ಸಹಾಯ ಮಾಡಬಲ್ಲೆ.';
        } else if (language === 'ml') {
          reply = 'നിങ്ങളുടെ ദൈനംദിന മരുന്നുകളെക്കുറിച്ചും ഡോക്ടർ കൂടിക്കാഴ്ചകളെക്കുറിച്ചും ഞാൻ സഹായിക്കാം.';
        }
        setAssistantResponse(reply);
        speak(reply);
      }
    } catch (err) {
      const errReply = 'Sorry, could not process request right now. Please try again.';
      setAssistantResponse(errReply);
      speak(errReply);
    }
  };

  const startListening = () => {
    if (!supported) return;

    try {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.lang = getSpeechLangCode ? getSpeechLangCode(language) : 'en-IN';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      setIsListening(true);
      setTranscript('Listening...');

      recognition.onresult = (event) => {
        const spoken = event.results[0][0].transcript;
        setIsListening(false);
        handleCommand(spoken);
      };

      recognition.onerror = () => {
        setIsListening(false);
        setTranscript('Could not catch your voice. Please try typing or speak again.');
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (e) {
      setIsListening(false);
      setSupported(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-surface-200">
        <div className="flex items-center justify-between pb-4 border-b border-surface-100">
          <div className="flex items-center space-x-2.5">
            <div className="p-2.5 bg-brand-50 text-brand-600 rounded-2xl">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">ElderCare Voice Assistant</h3>
              <p className="text-xs text-slate-500">English & Tamil Voice Guidance</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 rounded-xl">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Central Voice Listening Orb */}
        <div className="my-8 flex flex-col items-center text-center">
          <button
            onClick={startListening}
            disabled={isListening}
            className={`w-24 h-24 rounded-full flex items-center justify-center text-white shadow-xl transition-all transform duration-300 ${
              isListening
                ? 'bg-rose-500 animate-pulse scale-110'
                : 'bg-gradient-to-tr from-brand-600 to-teal-500 hover:scale-105 active:scale-95'
            }`}
          >
            {isListening ? <Mic className="w-10 h-10 animate-bounce" /> : <Mic className="w-10 h-10" />}
          </button>
          <p className="text-sm font-semibold text-slate-700 mt-4">
            {isListening ? 'Listening now... Speak clearly' : 'Tap the microphone to speak'}
          </p>

          {/* Transcript Display */}
          {transcript && (
            <div className="mt-3 px-4 py-2 bg-surface-50 rounded-xl border border-surface-200 text-xs font-medium text-slate-600">
              "{transcript}"
            </div>
          )}

          {/* Assistant Voice Response Box */}
          {assistantResponse && (
            <div className="mt-4 p-4 bg-brand-50 rounded-2xl border border-brand-200 text-sm font-medium text-brand-900 flex items-start space-x-3 text-left w-full">
              <Volume2 className="w-5 h-5 text-brand-600 flex-shrink-0 mt-0.5" />
              <span>{assistantResponse}</span>
            </div>
          )}
        </div>

        {/* Typed Fallback Query */}
        <div className="space-y-3 pt-3 border-t border-surface-100">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Quick Prompts
          </p>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleCommand('What medicines should I take today?')}
              className="text-xs bg-surface-100 hover:bg-brand-50 text-slate-700 hover:text-brand-700 px-3 py-1.5 rounded-xl border border-surface-200 transition"
            >
              💊 What medicines today?
            </button>
            <button
              onClick={() => handleCommand('Show my next appointment')}
              className="text-xs bg-surface-100 hover:bg-brand-50 text-slate-700 hover:text-brand-700 px-3 py-1.5 rounded-xl border border-surface-200 transition"
            >
              📅 Next appointment?
            </button>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (textQuery.trim()) {
                handleCommand(textQuery);
                setTextQuery('');
              }
            }}
            className="flex items-center space-x-2 mt-3"
          >
            <input
              type="text"
              value={textQuery}
              onChange={(e) => setTextQuery(e.target.value)}
              placeholder="Or type a question here..."
              className="flex-1 bg-surface-50 border border-surface-200 rounded-xl px-4 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
            <button
              type="submit"
              className="p-2 bg-brand-600 text-white rounded-xl hover:bg-brand-700 transition"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default VoiceAssistantModal;
