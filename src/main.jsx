import React from 'react';
import { createRoot } from 'react-dom/client';
// 현재 실행 버전: 서사형. V3 성장형(24문항)은 src/life/GrowthApp.jsx에 그대로 보존되어 있습니다.
// V3로 되돌리려면 아래 import를 './life/GrowthApp.jsx'로 바꾸세요.
import App from './life/NarrativeApp.jsx';
import './life/life.css';

createRoot(document.getElementById('root')).render(<React.StrictMode><App /></React.StrictMode>);
