import {useTranslation} from './Language.jsx';
import { motion } from 'motion/react';
// Replaceable, original SVG placeholder assets; no external images or generation APIs.
export function Character({stage='어린 시절',appearance='short',reaction=false}) {
 const t=useTranslation();
 const child=stage==='어린 시절'; const teen=stage==='청소년기';
 return <motion.svg className={`pixel-person ${child?'child':teen?'teen':'adult'}`} viewBox="0 0 32 48" shapeRendering="crispEdges" aria-label={t(`${stage} 캐릭터`)} role="img" animate={{y:reaction?[0,-4,0]:0}} transition={{duration:.45}}>
 <ellipse cx="16" cy="46" rx="12" ry="2" fill="#534837" opacity=".16"/>
 {appearance==='long'&&<path d="M5 10H27V32H23V29H8V32H5Z" fill="#674537"/>}
 <path d="M7 5H12V3H21V5H25V9H28V21H25V25H7V22H4V11H7Z" fill="#674537"/>
 <path d="M8 12H11V9H14V12H23V15H26V22H23V26H9V23H6V16H8Z" fill="#ffddbc"/>
 {appearance==='crop'&&<path d="M7 9H25V14H22V11H10V15H6Z" fill="#302d35"/>}
 <path d="M10 18H12V20H10ZM21 18H23V20H21Z" fill="#302d35"/>
 <path d="M14 24H19V28H14Z" fill="#ffddbc"/>
 <path d="M9 28H24V37H9Z" fill={child?'#e6b874':teen?'#b2bacc':'#b4a4c5'}/>
 <path d="M7 29H10V38H7ZM23 29H26V38H23Z" fill="#ffddbc"/>
 <path d="M11 37H23V40H19V44H16V40H14V44H11Z" fill="#54637a"/>
 <path d="M9 44H14V46H9ZM19 44H24V46H19Z" fill="#463e46"/>
 </motion.svg>;
}
export default function Scene({event,appearance,feedback}) {
 const t=useTranslation();
 const outside=['놀이터','공원','갈림길','캠퍼스'].includes(event.place);
 return <div className={`pixel-scene ${outside?'outside':'inside'}`}>
 <svg className="scenery" viewBox="0 0 640 260" preserveAspectRatio="xMidYMid slice" shapeRendering="crispEdges" aria-hidden="true">
 <rect width="640" height="260" fill={outside?'#dce9e0':'#eee0c8'}/>
 {outside?<><path d="M0 160H640V260H0Z" fill="#b7c9a0"/><path d="M0 208H640V260H0Z" fill="#e1cda8"/>
 <path d="M70 55H145V73H70ZM100 42H126V82H100ZM460 40H535V55H460Z" fill="#f8f5e9"/>
 <path d="M505 104H518V201H505Z" fill="#92725b"/><path d="M474 70H540V95H556V139H532V155H481V137H461V96H474Z" fill="#7e9c79"/>
 <path d="M75 150H188V160H75ZM85 160H93V202H85ZM170 160H178V202H170Z" fill="#b08a68"/>
 {event.place==='놀이터'&&<path d="M240 95H250V193H240ZM350 95H360V193H350ZM240 90H360V100H240ZM275 100H279V165H275ZM324 100H328V165H324ZM270 165H333V172H270Z" fill="#c28b6e"/>}</>:<>
 <path d="M0 205H640V260H0Z" fill="#c7b197"/><path d="M0 200H640V208H0Z" fill="#a88e75"/>
 <path d="M70 40H190V145H70Z" fill="#a58b75"/><path d="M77 47H183V138H77Z" fill="#c9ded9"/><path d="M127 47H133V138H127ZM77 92H183V98H77Z" fill="#f8eddb"/>
 <path d="M440 70H550V196H440Z" fill="#ac8b70"/><path d="M449 80H541V109H449ZM449 118H541V147H449ZM449 156H541V187H449Z" fill="#735f50"/>
 <path d="M455 83H466V108H455ZM471 88H483V108H471ZM491 80H505V108H491Z" fill="#c4ceb1"/>
 <path d="M175 177H265V187H175ZM184 187H193V222H184ZM248 187H257V222H248Z" fill="#977663"/>
 </>}
 </svg><span className="place-label">{t(event.place)}</span>
 <div className="cast"><Character stage={event.stage} appearance={appearance} reaction={Boolean(feedback)}/></div>
 {feedback&&<motion.div className="reaction-bubble" initial={{opacity:0,y:8}} animate={{opacity:1,y:0}}>{t("기억에 남을 작은 순간")}</motion.div>}
 </div>;
}
