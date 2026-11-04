import {createContext,useContext} from 'react';
import {translate} from './translations.js';
export const LanguageContext=createContext('ko');
export const useTranslation=()=>{const language=useContext(LanguageContext);return text=>translate(text,language);};
