       var span=document.getElementsByClassName('spanish_translation');
       var eng=document.getElementsByClassName('english_translation');

       var spanFounder=document.getElementsByClassName('spanish_translation-founder');
       var engFounder=document.getElementsByClassName('english_translation-founder');

       var dancemusicSpanish=document.getElementsByClassName('indian-dance-music-spanish');
       var dancemusicEnglish=document.getElementsByClassName('indian-dance-music-english');

       var teamIntroSpanish = document.getElementsByClassName('team-intro-spanish');
       var teamIntroEnglish = document.getElementsByClassName('team-intro-english');
       
       var mapIntroSpanish = document.getElementsByClassName('map-intro-spanish');
       var mapIntroEnglish = document.getElementsByClassName('map-intro-english');
       
       
        eng[0].style.display='none';
        engFounder[0].style.display='none';
        dancemusicEnglish[0].style.display='none';
       
        //Function call when user click the convert to english button in the about baila bollywood section
       function spanToeng()
       {
         eng[0].style.display='block';
         span[0].style.display='none';
       }
        //Function call when user click the convert to spanish button in the about baila bollywood section
       function engTospan()
       {
         eng[0].style.display='none';
         span[0].style.display='block';
       }
       //Function call when user click the convert to spanish button in the about founder section
       function engTospanFounder()
       {
        spanFounder[0].style.display='block';
          engFounder[0].style.display='none';
       }
       //Function call when user click the convert to english button in the about founder section
       function spanToengFounder()
       {
          engFounder[0].style.display='block';
          spanFounder[0].style.display='none';
       }
       //Function call when user click the convert to english button in the classcial indian dance and music 
       function DanceMusicToEnglish()
       {
        dancemusicSpanish[0].style.display='none';
        dancemusicEnglish[0].style.display='block';
       }
       //Function call when user clicks the convert to spanish button in the classical indian dance and music section
       function DanceMusicToSpanish()
       {
           dancemusicEnglish[0].style.display='none';
           dancemusicSpanish[0].style.display='block';
       } 

       function spanToengTeamIntro()
       {
        teamIntroSpanish[0].style.display = 'none';
        teamIntroEnglish[0].style.display = 'block';
       }

       function engTospaTeamIntro()
       {
        teamIntroSpanish[0].style.display = 'block';
        teamIntroEnglish[0].style.display = 'none';
       }

       function spanToengMapIntro()
       {
        mapIntroSpanish[0].style.display = 'none';
        mapIntroEnglish[0].style.display = 'block';
       }

       function engTospaMapIntro()
       {
        mapIntroSpanish[0].style.display = 'block';
        mapIntroEnglish[0].style.display = 'none';
       }