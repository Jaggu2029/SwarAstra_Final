export const scienceLevels = [
  {
    levelNumber: 1,
    levelName_en: 'Level 1 (Living & Non-Living / Our Body)',
    levelName_gu: 'લેવલ 1 (સજીવ નિર્જીવ / આપણું શરીર)',
    topic: 'living_body',
    questionBank: [
      // MCQ (need 7)
      { id: '1_m1', type: 'mcq', question_gu: 'નીચેનામાંથી કઈ વસ્તુ સજીવ છે?', options_gu: ['પથ્થર', 'ગાય', 'ટેબલ', 'ખુરશી'], correct_answer_gu: 'ગાય', explanation_gu: 'ગાય શ્વાસ લે છે અને હલનચલન કરે છે, તેથી તે સજીવ છે.' },
      { id: '1_m2', type: 'mcq', question_gu: 'આપણે શાનાથી જોઈએ છીએ?', options_gu: ['કાન', 'નાક', 'આંખ', 'હાથ'], correct_answer_gu: 'આંખ', explanation_gu: 'આંખ એ જોવાની ઇન્દ્રિય છે.' },
      { id: '1_m3', type: 'mcq', question_gu: 'આપણને શ્વાસ લેવા માટે શું જોઈએ?', options_gu: ['હવા', 'પાણી', 'ખોરાક', 'માટી'], correct_answer_gu: 'હવા', explanation_gu: 'તમામ સજીવોને જીવવા માટે હવાની જરૂર પડે છે.' },
      { id: '1_m4', type: 'mcq', question_gu: 'નીચેનામાંથી કયું આપણું જ્ઞાનેન્દ્રિય નથી?', options_gu: ['આંખ', 'કાન', 'નાક', 'વાળ'], correct_answer_gu: 'વાળ', explanation_gu: 'વાળ એ જ્ઞાનેન્દ્રિય (sense organ) નથી.' },
      { id: '1_m5', type: 'mcq', question_gu: 'જમતા પહેલા આપણે શું કરવું જોઈએ?', options_gu: ['રમવું', 'હાથ ધોવા', 'સુઈ જવું', 'ટીવી જોવું'], correct_answer_gu: 'હાથ ધોવા', explanation_gu: 'કીટાણુઓથી બચવા જમતા પહેલા હાથ ધોવા જરૂરી છે.' },
      { id: '1_m6', type: 'mcq', question_gu: 'નીચેનામાંથી નિર્જીવ વસ્તુ કઈ છે?', options_gu: ['ઝાડ', 'માછલી', 'પેન્સિલ', 'કબૂતર'], correct_answer_gu: 'પેન્સિલ', explanation_gu: 'પેન્સિલ શ્વાસ લેતી નથી કે વધતી નથી.' },
      { id: '1_m7', type: 'mcq', question_gu: 'આપણે શાના વડે સાંભળીએ છીએ?', options_gu: ['કાન', 'આંખ', 'નાક', 'જીભ'], correct_answer_gu: 'કાન', explanation_gu: 'કાન એ સાંભળવાની ઇન્દ્રિય છે.' },
      { id: '1_m8', type: 'mcq', question_gu: 'આપણે સ્વાદ ક્યાંથી પારખીએ છીએ?', options_gu: ['આંખ', 'કાન', 'જીભ', 'ત્વચા'], correct_answer_gu: 'જીભ', explanation_gu: 'જીભ દ્વારા આપણે સ્વાદ જાણી શકીએ છીએ.' },
      { id: '1_m9', type: 'mcq', question_gu: 'સજીવોને વધવા માટે શાની જરૂર છે?', options_gu: ['ખોરાક', 'રમકડાં', 'ટીવી', 'પથ્થર'], correct_answer_gu: 'ખોરાક', explanation_gu: 'સજીવોને ઊર્જા અને વૃદ્ધિ માટે ખોરાક જોઈએ.' },
      { id: '1_m10', type: 'mcq', question_gu: 'હાથ પર શું પહેરાય છે?', options_gu: ['ચશ્મા', 'ઘડિયાળ', 'બૂટ', 'ટોપી'], correct_answer_gu: 'ઘડિયાળ', explanation_gu: 'ઘડિયાળ કાંડા પર પહેરવામાં આવે છે.' },
      
      // True/False (need 2)
      { id: '1_tf1', type: 'true_false', question_gu: 'વનસ્પતિ સજીવ છે.', options_gu: ['સાચું', 'ખોટું'], correct_answer_gu: 'સાચું', explanation_gu: 'વનસ્પતિ વધે છે અને તેને પાણી-હવાની જરૂર છે, તેથી તે સજીવ છે.' },
      { id: '1_tf2', type: 'true_false', question_gu: 'કાર શ્વાસ લઈ શકે છે.', options_gu: ['સાચું', 'ખોટું'], correct_answer_gu: 'ખોટું', explanation_gu: 'કાર નિર્જીવ વસ્તુ છે, તે શ્વાસ લેતી નથી.' },
      { id: '1_tf3', type: 'true_false', question_gu: 'આપણે રોજે સ્નાન કરવું જોઈએ.', options_gu: ['સાચું', 'ખોટું'], correct_answer_gu: 'સાચું', explanation_gu: 'શરીર સ્વચ્છ રાખવા માટે રોજ સ્નાન જરૂરી છે.' },
      { id: '1_tf4', type: 'true_false', question_gu: 'પથ્થરને ભૂખ લાગે છે.', options_gu: ['સાચું', 'ખોટું'], correct_answer_gu: 'ખોટું', explanation_gu: 'પથ્થર નિર્જીવ છે, તેને ખોરાક જોઈતો નથી.' },

      // Odd-One-Out (need 1)
      { id: '1_o1', type: 'odd_one_out', question_gu: 'નીચેનામાંથી અલગ પડતી વસ્તુ શોધો:', options_gu: ['કુતરો', 'બિલાડી', 'મોબાઇલ', 'ગાય'], correct_answer_gu: 'મોબાઇલ', explanation_gu: 'મોબાઇલ નિર્જીવ છે, બાકીના પ્રાણીઓ (સજીવ) છે.' },
      { id: '1_o2', type: 'odd_one_out', question_gu: 'શરીરના અંગોમાંથી અલગ શોધો:', options_gu: ['હાથ', 'પગ', 'પેન', 'માથું'], correct_answer_gu: 'પેન', explanation_gu: 'પેન એ નિર્જીવ વસ્તુ છે, જ્યારે અન્ય શરીરના અંગો છે.' },
      { id: '1_o3', type: 'odd_one_out', question_gu: 'અલગ પડતી ઇન્દ્રિય શોધો:', options_gu: ['આંખ', 'કાન', 'પુસ્તક', 'નાક'], correct_answer_gu: 'પુસ્તક', explanation_gu: 'પુસ્તક એ ભણવાની વસ્તુ છે, જ્યારે અન્ય જ્ઞાનેન્દ્રિયો છે.' },
    ]
  },
  {
    levelNumber: 2,
    levelName_en: 'Level 2 (Plants & Animals)',
    levelName_gu: 'લેવલ 2 (વનસ્પતિ અને પ્રાણીઓ)',
    topic: 'plants_animals',
    questionBank: [
      // MCQ
      { id: '2_m1', type: 'mcq', question_gu: 'છોડને વધવા માટે શું જોઈએ?', options_gu: ['સૂર્યપ્રકાશ, પાણી, હવા', 'દૂધ', 'મીઠું', 'બરફ'], correct_answer_gu: 'સૂર્યપ્રકાશ, પાણી, હવા', explanation_gu: 'છોડને પ્રકાશસંશ્લેષણ માટે આ ત્રણ વસ્તુઓ જરૂરી છે.' },
      { id: '2_m2', type: 'mcq', question_gu: 'વનસ્પતિનો કયો ભાગ જમીનની નીચે હોય છે?', options_gu: ['પાન', 'ફૂલ', 'મૂળ', 'ડાળી'], correct_answer_gu: 'મૂળ', explanation_gu: 'મૂળ જમીનમાંથી પાણી અને ક્ષાર ચૂસે છે.' },
      { id: '2_m3', type: 'mcq', question_gu: 'પતંગિયાનું જીવન ચક્ર ક્યાંથી શરૂ થાય છે?', options_gu: ['ઈંડા', 'ઈયળ', 'કોશેટો', 'પતંગિયું'], correct_answer_gu: 'ઈંડા', explanation_gu: 'પતંગિયું ઈંડા મૂકે છે, જેમાંથી ઈયળ નીકળે છે.' },
      { id: '2_m4', type: 'mcq', question_gu: 'માત્ર ઘાસ ખાનાર પ્રાણીને શું કહેવાય?', options_gu: ['માંસાહારી', 'શાકાહારી', 'મિશ્રાહારી', 'ભક્ષક'], correct_answer_gu: 'શાકાહારી', explanation_gu: 'ગાય અને હરણ જેવા પ્રાણીઓ શાકાહારી (herbivores) છે.' },
      { id: '2_m5', type: 'mcq', question_gu: 'નીચેનામાંથી કયું માંસાહારી પ્રાણી છે?', options_gu: ['ગાય', 'હાથી', 'સિંહ', 'બકરી'], correct_answer_gu: 'સિંહ', explanation_gu: 'સિંહ અન્ય પ્રાણીઓનો શિકાર કરીને ખાય છે.' },
      { id: '2_m6', type: 'mcq', question_gu: 'પક્ષીઓને ઊડવા માટે શું હોય છે?', options_gu: ['હાથ', 'પગ', 'પાંખો', 'પૂંછડી'], correct_answer_gu: 'પાંખો', explanation_gu: 'પક્ષીઓ પાંખોની મદદથી ઉડી શકે છે.' },
      { id: '2_m7', type: 'mcq', question_gu: 'જળચર પ્રાણી કયું છે?', options_gu: ['વાઘ', 'માછલી', 'વાંદરો', 'સિંહ'], correct_answer_gu: 'માછલી', explanation_gu: 'માછલી પાણીમાં રહે છે, તેથી તે જળચર છે.' },
      { id: '2_m8', type: 'mcq', question_gu: 'કયું પ્રાણી જંગલનો રાજા કહેવાય છે?', options_gu: ['હાથી', 'સિંહ', 'વાઘ', 'ચિત્તો'], correct_answer_gu: 'સિંહ', explanation_gu: 'સિંહને જંગલનો રાજા માનવામાં આવે છે.' },
      { id: '2_m9', type: 'mcq', question_gu: 'છોડનો કયો ભાગ લીલો હોય છે?', options_gu: ['મૂળ', 'થડ', 'પર્ણ (પાન)', 'ફૂલ'], correct_answer_gu: 'પર્ણ (પાન)', explanation_gu: 'પાનમાં હરિતદ્રવ્ય (ક્લોરોફિલ) હોવાથી તે લીલા રંગના હોય છે.' },
      { id: '2_m10', type: 'mcq', question_gu: 'મધમાખી આપણને શું આપે છે?', options_gu: ['દૂધ', 'મધ', 'ઈંડા', 'ઊન'], correct_answer_gu: 'મધ', explanation_gu: 'મધમાખી ફૂલોમાંથી રસ ચૂસીને મધ બનાવે છે.' },
      
      // True/False
      { id: '2_tf1', type: 'true_false', question_gu: 'દેડકો પાણી અને જમીન બંને પર રહી શકે છે.', options_gu: ['સાચું', 'ખોટું'], correct_answer_gu: 'સાચું', explanation_gu: 'દેડકો ઉભયજીવી (amphibian) પ્રાણી છે.' },
      { id: '2_tf2', type: 'true_false', question_gu: 'બધા ફૂલોનો રંગ લાલ જ હોય છે.', options_gu: ['સાચું', 'ખોટું'], correct_answer_gu: 'ખોટું', explanation_gu: 'ફૂલો પીળા, સફેદ, વાદળી જેવા વિવિધ રંગોના હોય છે.' },
      { id: '2_tf3', type: 'true_false', question_gu: 'માછલી પાણીની બહાર જીવી શકતી નથી.', options_gu: ['સાચું', 'ખોટું'], correct_answer_gu: 'સાચું', explanation_gu: 'માછલી પાણીમાંથી ઓક્સિજન લેવા માટે અનુકૂળ છે.' },
      { id: '2_tf4', type: 'true_false', question_gu: 'હાથી માંસાહારી પ્રાણી છે.', options_gu: ['સાચું', 'ખોટું'], correct_answer_gu: 'ખોટું', explanation_gu: 'હાથી પાંદડાં અને ઘાસ ખાય છે, તે શાકાહારી છે.' },

      // Odd-One-Out
      { id: '2_o1', type: 'odd_one_out', question_gu: 'નીચેનામાંથી અલગ પ્રાણી શોધો:', options_gu: ['ગાય', 'બકરી', 'સિંહ', 'ભેંસ'], correct_answer_gu: 'સિંહ', explanation_gu: 'સિંહ માંસાહારી છે, જ્યારે બાકીના શાકાહારી છે.' },
      { id: '2_o2', type: 'odd_one_out', question_gu: 'અલગ પડતું ફળ શોધો:', options_gu: ['સફરજન', 'કેરી', 'ગાજર', 'કેળું'], correct_answer_gu: 'ગાજર', explanation_gu: 'ગાજર એ શાકભાજી (મૂળ) છે, ફળ નથી.' },
      { id: '2_o3', type: 'odd_one_out', question_gu: 'વનસ્પતિના ભાગમાંથી અલગ શોધો:', options_gu: ['મૂળ', 'થડ', 'પાન', 'ખુરશી'], correct_answer_gu: 'ખુરશી', explanation_gu: 'ખુરશી એ નિર્જીવ છે, જ્યારે અન્ય વનસ્પતિના અંગો છે.' },
    ]
  },
  {
    levelNumber: 3,
    levelName_en: 'Level 3 (Matter & Simple Machines)',
    levelName_gu: 'લેવલ 3 (પદાર્થ અને સાદા યંત્રો)',
    topic: 'matter_machines',
    questionBank: [
      // MCQ
      { id: '3_m1', type: 'mcq', question_gu: 'બરફ એ પાણીનું કયું સ્વરૂપ છે?', options_gu: ['ઘન', 'પ્રવાહી', 'વાયુ', 'પ્લાઝમા'], correct_answer_gu: 'ઘન', explanation_gu: 'બરફ એ પાણીનું ઘન (solid) સ્વરૂપ છે.' },
      { id: '3_m2', type: 'mcq', question_gu: 'કાતર એ કયા પ્રકારનું સાદું યંત્ર છે?', options_gu: ['ઉચ્ચાલન (Lever)', 'પુલિ (Pulley)', 'ચક્ર (Wheel)', 'ઢાળ (Inclined plane)'], correct_answer_gu: 'ઉચ્ચાલન (Lever)', explanation_gu: 'કાતર એ ઉચ્ચાલનનો એક પ્રકાર છે.' },
      { id: '3_m3', type: 'mcq', question_gu: 'પાણીને ગરમ કરવાથી શું બને છે?', options_gu: ['બરફ', 'વરાળ (વાયુ)', 'પથ્થર', 'માટી'], correct_answer_gu: 'વરાળ (વાયુ)', explanation_gu: 'ગરમીથી પાણીનું બાષ્પીભવન થઈ તે વરાળ બને છે.' },
      { id: '3_m4', type: 'mcq', question_gu: 'નીચેનામાંથી કયો પદાર્થ પ્રવાહી છે?', options_gu: ['લાકડું', 'લોખંડ', 'દૂધ', 'પથ્થર'], correct_answer_gu: 'દૂધ', explanation_gu: 'દૂધ વહી શકે છે, તેથી તે પ્રવાહી છે.' },
      { id: '3_m5', type: 'mcq', question_gu: 'કૂવામાંથી પાણી ખેંચવા માટે કયા યંત્રનો ઉપયોગ થાય છે?', options_gu: ['ગરગડી (Pulley)', 'સ્ક્રૂ (Screw)', 'કાતર', 'ઢાળ'], correct_answer_gu: 'ગરગડી (Pulley)', explanation_gu: 'ગરગડીની મદદથી વજન ખેંચવું સરળ બને છે.' },
      { id: '3_m6', type: 'mcq', question_gu: 'વજનદાર વસ્તુને ટ્રકમાં ચડાવવા માટે શું વાપરશો?', options_gu: ['ઢાળ (Inclined Plane)', 'કાતર', 'ચીપિયો', 'સ્ક્રૂ'], correct_answer_gu: 'ઢાળ (Inclined Plane)', explanation_gu: 'ઢાળ વડે વસ્તુઓને સરળતાથી ઊંચાઈ પર ચડાવી શકાય છે.' },
      { id: '3_m7', type: 'mcq', question_gu: 'વાહનોમાં ગોળ ફરતો ભાગ કયો છે?', options_gu: ['કાચ', 'સીટ', 'પૈડું (ચક્ર)', 'દરવાજો'], correct_answer_gu: 'પૈડું (ચક્ર)', explanation_gu: 'પૈડું એ એક મહત્વપૂર્ણ સાદું યંત્ર છે.' },
      { id: '3_m8', type: 'mcq', question_gu: 'નીચેનામાંથી વાયુ સ્વરૂપ કયું છે?', options_gu: ['પાણી', 'બરફ', 'ઓક્સિજન', 'લોખંડ'], correct_answer_gu: 'ઓક્સિજન', explanation_gu: 'ઓક્સિજન હવામાં રહેલો વાયુ છે.' },
      { id: '3_m9', type: 'mcq', question_gu: 'કયા પદાર્થનો આકાર નિશ્ચિત હોય છે?', options_gu: ['ઘન', 'પ્રવાહી', 'વાયુ', 'વરાળ'], correct_answer_gu: 'ઘન', explanation_gu: 'ઘન પદાર્થનો આકાર અને કદ નિશ્ચિત હોય છે.' },
      { id: '3_m10', type: 'mcq', question_gu: 'લાકડાને કાપવા માટે વપરાતી કરવત શું છે?', options_gu: ['પુલિ', 'ફાચર (Wedge)', 'ચક્ર', 'સ્ક્રૂ'], correct_answer_gu: 'ફાચર (Wedge)', explanation_gu: 'કરવત અને કુહાડી ફાચર પ્રકારના સાદા યંત્રો છે.' },
      
      // True/False
      { id: '3_tf1', type: 'true_false', question_gu: 'હવા જગ્યા રોકે છે.', options_gu: ['સાચું', 'ખોટું'], correct_answer_gu: 'સાચું', explanation_gu: 'હવા (વાયુ) ને પણ વજન હોય છે અને તે જગ્યા રોકે છે (દા.ત. ફુગ્ગો).' },
      { id: '3_tf2', type: 'true_false', question_gu: 'પ્રવાહી પદાર્થનો પોતાનો કોઈ નિશ્ચિત આકાર હોતો નથી.', options_gu: ['સાચું', 'ખોટું'], correct_answer_gu: 'સાચું', explanation_gu: 'પ્રવાહીને જે વાસણમાં ભરો તેનો આકાર ધારણ કરે છે.' },
      { id: '3_tf3', type: 'true_false', question_gu: 'પૈડાની શોધથી મુસાફરી અઘરી બની ગઈ.', options_gu: ['સાચું', 'ખોટું'], correct_answer_gu: 'ખોટું', explanation_gu: 'પૈડાની શોધથી મુસાફરી ખૂબ જ સરળ અને ઝડપી બની છે.' },
      { id: '3_tf4', type: 'true_false', question_gu: 'લોખંડ ઘન પદાર્થ છે.', options_gu: ['સાચું', 'ખોટું'], correct_answer_gu: 'સાચું', explanation_gu: 'લોખંડ કઠણ છે અને તેનો નિશ્ચિત આકાર છે.' },

      // Odd-One-Out
      { id: '3_o1', type: 'odd_one_out', question_gu: 'નીચેનામાંથી અલગ પડતો પદાર્થ શોધો:', options_gu: ['પાણી', 'દૂધ', 'જ્યુસ', 'પથ્થર'], correct_answer_gu: 'પથ્થર', explanation_gu: 'પથ્થર ઘન પદાર્થ છે, બાકીના પ્રવાહી છે.' },
      { id: '3_o2', type: 'odd_one_out', question_gu: 'અલગ સાદું યંત્ર શોધો:', options_gu: ['કાતર', 'ચીપિયો', 'સાયકલ', 'સાણસી'], correct_answer_gu: 'સાયકલ', explanation_gu: 'સાયકલ એક જટિલ યંત્ર છે, બાકીના સાદા યંત્રો (ઉચ્ચાલન) છે.' },
      { id: '3_o3', type: 'odd_one_out', question_gu: 'અલગ ઘન પદાર્થ શોધો:', options_gu: ['ટેબલ', 'ખુરશી', 'લાકડું', 'વરાળ'], correct_answer_gu: 'વરાળ', explanation_gu: 'વરાળ એ વાયુ છે, જ્યારે અન્ય ઘન પદાર્થો છે.' },
    ]
  },
  {
    levelNumber: 4,
    levelName_en: 'Level 4 (Forces, Energy & Environment)',
    levelName_gu: 'લેવલ 4 (બળ, ઉર્જા અને પર્યાવરણ)',
    topic: 'force_energy',
    questionBank: [
      // MCQ
      { id: '4_m1', type: 'mcq', question_gu: 'પૃથ્વી પર ઉર્જાનો સૌથી મોટો સ્ત્રોત કયો છે?', options_gu: ['ચંદ્ર', 'તારા', 'સૂર્ય', 'પવન'], correct_answer_gu: 'સૂર્ય', explanation_gu: 'સૂર્ય એ પૃથ્વી પરની તમામ ઉર્જાનો મુખ્ય સ્ત્રોત છે.' },
      { id: '4_m2', type: 'mcq', question_gu: 'વસ્તુને ખસેડવા માટે આપણે શું લગાવીએ છીએ?', options_gu: ['બળ (ધક્કો/ખેંચાણ)', 'અવાજ', 'રંગ', 'પ્રકાશ'], correct_answer_gu: 'બળ (ધક્કો/ખેંચાણ)', explanation_gu: 'કોઈપણ વસ્તુની ગતિ બદલવા માટે બળ જરૂરી છે.' },
      { id: '4_m3', type: 'mcq', question_gu: 'વરસાદ લાવવામાં કઈ પ્રક્રિયા મદદરૂપ છે?', options_gu: ['જળચક્ર (Water Cycle)', 'ઉચ્ચાલન', 'બળ', 'પ્રદૂષણ'], correct_answer_gu: 'જળચક્ર (Water Cycle)', explanation_gu: 'બાષ્પીભવન અને ઘનીભવન દ્વારા જળચક્ર વરસાદ લાવે છે.' },
      { id: '4_m4', type: 'mcq', question_gu: 'ધરતી પર વસ્તુઓને નીચે કોણ ખેંચી રાખે છે?', options_gu: ['પવન', 'ગુરુત્વાકર્ષણ બળ', 'ચુંબક', 'પાણી'], correct_answer_gu: 'ગુરુત્વાકર્ષણ બળ', explanation_gu: 'ગુરુત્વાકર્ષણને કારણે વસ્તુઓ પૃથ્વી તરફ પડે છે.' },
      { id: '4_m5', type: 'mcq', question_gu: 'નીચેનામાંથી પુનઃપ્રાપ્ય (Renewable) ઉર્જા કઈ છે?', options_gu: ['કોલસો', 'પેટ્રોલ', 'સૌર ઉર્જા', 'ડીઝલ'], correct_answer_gu: 'સૌર ઉર્જા', explanation_gu: 'સૂર્યપ્રકાશ ક્યારેય ખૂટતો નથી, તેથી તે પુનઃપ્રાપ્ય છે.' },
      { id: '4_m6', type: 'mcq', question_gu: 'વાહનોના ધુમાડાથી કયું પ્રદૂષણ થાય છે?', options_gu: ['જળ પ્રદૂષણ', 'હવા પ્રદૂષણ', 'ધ્વનિ પ્રદૂષણ', 'જમીન પ્રદૂષણ'], correct_answer_gu: 'હવા પ્રદૂષણ', explanation_gu: 'ધુમાડો હવાને દૂષિત કરે છે.' },
      { id: '4_m7', type: 'mcq', question_gu: 'પર્યાવરણ બચાવવા માટે આપણે શું કરવું જોઈએ?', options_gu: ['વૃક્ષો કાપવા', 'વધુ પ્લાસ્ટિક વાપરવું', 'વૃક્ષો વાવવા', 'કચરો રસ્તા પર ફેંકવો'], correct_answer_gu: 'વૃક્ષો વાવવા', explanation_gu: 'વૃક્ષો પર્યાવરણને શુદ્ધ અને સંતુલિત રાખે છે.' },
      { id: '4_m8', type: 'mcq', question_gu: 'વધારે પડતા ઘોંઘાટથી કયું પ્રદૂષણ થાય છે?', options_gu: ['હવા પ્રદૂષણ', 'ધ્વનિ (અવાજ) પ્રદૂષણ', 'જળ પ્રદૂષણ', 'જમીન પ્રદૂષણ'], correct_answer_gu: 'ધ્વનિ (અવાજ) પ્રદૂષણ', explanation_gu: 'ઘોંઘાટથી કાનને નુકસાન થાય છે.' },
      { id: '4_m9', type: 'mcq', question_gu: 'ચુંબક કઈ વસ્તુને પોતાની તરફ ખેંચે છે?', options_gu: ['પ્લાસ્ટિક', 'લાકડું', 'લોખંડ', 'કાગળ'], correct_answer_gu: 'લોખંડ', explanation_gu: 'ચુંબક લોખંડ જેવી ધાતુઓ પ્રત્યે આકર્ષણ ધરાવે છે.' },
      { id: '4_m10', type: 'mcq', question_gu: 'જળચક્રમાં સૂર્યની ગરમીથી પાણીનું શું થાય છે?', options_gu: ['બરફ બને છે', 'વરાળ બને છે', 'મીઠું બને છે', 'રંગ બદલાય છે'], correct_answer_gu: 'વરાળ બને છે', explanation_gu: 'સૂર્યની ગરમીથી પાણીનું બાષ્પીભવન થાય છે.' },
      
      // True/False
      { id: '4_tf1', type: 'true_false', question_gu: 'પ્લાસ્ટિકનો કચરો પર્યાવરણ માટે સારો છે.', options_gu: ['સાચું', 'ખોટું'], correct_answer_gu: 'ખોટું', explanation_gu: 'પ્લાસ્ટિક વર્ષો સુધી જમીનમાં સડતું નથી અને પ્રદૂષણ ફેલાવે છે.' },
      { id: '4_tf2', type: 'true_false', question_gu: 'પવનચક્કી હવાની ઉર્જાનો ઉપયોગ કરે છે.', options_gu: ['સાચું', 'ખોટું'], correct_answer_gu: 'સાચું', explanation_gu: 'પવનચક્કી (Windmill) પવન ઉર્જાથી વીજળી ઉત્પન્ન કરે છે.' },
      { id: '4_tf3', type: 'true_false', question_gu: 'કાર ચલાવવા માટે પેટ્રોલ કે ડીઝલની જરૂર પડતી નથી.', options_gu: ['સાચું', 'ખોટું'], correct_answer_gu: 'ખોટું', explanation_gu: 'મોટાભાગના વાહનોને બળતણ તરીકે પેટ્રોલ/ડીઝલ જોઈએ.' },
      { id: '4_tf4', type: 'true_false', question_gu: 'કચરો હંમેશા કચરાપેટીમાં જ નાખવો જોઈએ.', options_gu: ['સાચું', 'ખોટું'], correct_answer_gu: 'સાચું', explanation_gu: 'સ્વચ્છતા જાળવવા અને રોગચાળો અટકાવવા કચરાપેટીનો ઉપયોગ કરવો.' },

      // Odd-One-Out
      { id: '4_o1', type: 'odd_one_out', question_gu: 'અલગ પડતો ઉર્જાનો સ્ત્રોત શોધો:', options_gu: ['સૂર્ય', 'પવન', 'પાણી', 'પેટ્રોલ'], correct_answer_gu: 'પેટ્રોલ', explanation_gu: 'પેટ્રોલ ખૂટી જાય તેવો સ્ત્રોત છે, બાકીના પુનઃપ્રાપ્ય છે.' },
      { id: '4_o2', type: 'odd_one_out', question_gu: 'અલગ પ્રદૂષણનું કારણ શોધો:', options_gu: ['વૃક્ષ વાવવા', 'ધુમાડો કાઢતાં વાહનો', 'કારખાનાનું ગંદુ પાણી', 'પ્લાસ્ટિક સળગાવવું'], correct_answer_gu: 'વૃક્ષ વાવવા', explanation_gu: 'વૃક્ષ વાવવાથી પ્રદૂષણ ઘટે છે, વધતું નથી.' },
      { id: '4_o3', type: 'odd_one_out', question_gu: 'અલગ બળ શોધો:', options_gu: ['ધક્કો મારવો', 'દોરડું ખેંચવું', 'પુસ્તક ઊંચકવું', 'સુઈ જવું'], correct_answer_gu: 'સુઈ જવું', explanation_gu: 'સુઈ જવામાં કોઈ સક્રિય બળ નથી વપરાતું.' },
    ]
  }
];

export const generateScienceQuiz = (levelNumber) => {
  const level = scienceLevels.find(l => l.levelNumber === levelNumber);
  if (!level) return [];

  const mcqs = level.questionBank.filter(q => q.type === 'mcq');
  const tfs = level.questionBank.filter(q => q.type === 'true_false');
  const odds = level.questionBank.filter(q => q.type === 'odd_one_out');

  // Shuffle arrays helper
  const shuffle = (array) => [...array].sort(() => Math.random() - 0.5);

  const selectedMcqs = shuffle(mcqs).slice(0, 7);
  const selectedTfs = shuffle(tfs).slice(0, 2);
  const selectedOdds = shuffle(odds).slice(0, 1);

  // Combine and shuffle the 10 questions
  const quiz = shuffle([...selectedMcqs, ...selectedTfs, ...selectedOdds]);

  // Shuffle options inside MCQ and Odd-One-Out (True/False keep their order)
  return quiz.map(q => {
    if (q.type === 'mcq' || q.type === 'odd_one_out') {
      return { ...q, options_gu: shuffle(q.options_gu) };
    }
    return q;
  });
};
