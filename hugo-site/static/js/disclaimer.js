/* Keep the disclaimer modal closed for the rest of the session once accepted.
   Loaded right after the modal markup (not deferred) so it never flashes. */
    (function(){
      var m=document.getElementById('warning-modal');
      try{if(sessionStorage.getItem('warningDismissed')){m.classList.add('hidden');}}catch(e){}
      window.dismissWarning=function(){m.classList.add('hidden');try{sessionStorage.setItem('warningDismissed','1');}catch(e){}};
    })();
  
