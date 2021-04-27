$("#upCheckbox").on('change',function(ev){
   var checked = $(this).prop('checked');
   if(checked){
      $("#up-pay-monthly-container").show();
      // $(".uplift-banner").show();
      $(".cc_info").hide();
      window.Uplift.Agent.select();
   }else{
      $("#up-pay-monthly-container").hide();
      // $(".uplift-banner").hide();
      $(".cc_info").show();
      window.Uplift.Agent.deselect();
   }
});

 // --------- UPLIFT INTEGRATION --------------------------

window.upReady = function(){
   window.Uplift.Agent.init(getInitConfig());

   // Retrieve trip information
   const tripInfo = getTripInfo();
   const tripId = getTripId();

   if (tripId !== null && tripId != 'null') {
     window.Uplift.Agent.updateTrip(tripId, tripInfo); 
   } else {
     window.Uplift.Agent.createTrip(tripInfo); 
   }
}

function getInitConfig(isCheckout = true){
  const config = {
    agent:{
      id: $("#email2").val(),   //required
      //agencyId: '',           //optional
      //email: '',              //optional but recommended
      //firstName: '',          //optional
      //familyName: '',         //optional
      //phoneNumber: ''         //optional
    },
    locale: 'en-US',
    currency: 'USD',
    onChange: function(tripOffer){ 
      onChange(tripOffer) 
    },
    sessionTokenCallback: function(token){
      if(typeof token !== "undefined"){
        setCookie('trip_token',token);
      }
      return 'asdf';
    },
    payMonthlyContainer: '#up-pay-monthly-container',
    checkout: isCheckout
  }
  return config;
}

function onChange(tripOffer){
  console.log('On Change: '+tripOffer.status);
  switch(tripOffer.status){
    case "OFFER_AVAILABLE":
      $(".upsell_div").show();
      if(tripOffer.tripId != null){
        console.log("saving id: "+tripOffer.tripId);
        setCookie('tripId', tripOffer.tripId, 60);
      }
      break;

    case "OFFER_UNAVAILABLE":
      console.log("saving id: "+ null);
      setCookie('tripId', null, 60);
      break;
      
    case "TOKEN_AVAILABLE":
      // CHECKOUT BUTTON SHOWS
      $(".checkout_btn").show();
      break;

    case "TOKEN_RETRIEVED":
      // TOKEN HAS BEEN RETRIEVED
      console.log('Token retrieved', tripOffer)
      setCookie('token',JSON.stringify(tripOffer.token));
      break;

    case "SERVICE_UNAVAILABLE":
      $(".upsell_div").hide();
      break;

    default: break;
  }
}

function getTripInfo(){
   var total = parseFloat($("#TotalDue").val()).toFixed(2);
   total = parseInt(total.replace('.',''));
   var travelers = [
     {
       id: 0,
       first_name: 'Arthur',//$("#fname1").val(),
     last_name: 'Davis',//$("#lname1").val()
     },
   //   {
   //     id: 1,
   //     first_name: $("#fname2").val(),
   //     last_name: $("#fname2").val()
   //   },
   ];
   var billing_contact = {
     first_name: 'Arthur',//$("#fname1").val(),
     last_name: 'Davis',//$("#lname1").val()
   };

   var arrival = formatDate($("#aDate").val());
   var departure = formatDate($("#dDate").val());

   var hotel_reservations = [
     {
       hotel_name: "Pueblo Bonito Sunset Beach",
       check_in: arrival,
       check_out: departure
     }
   ];
   const tripInfo = {
     order_amount: total,
     billing_contact: billing_contact,
     travelers: travelers,
     hotel_reservations: hotel_reservations
   };
   return tripInfo;
}

function getTripId(){
  return getCookie('tripId');
}

function upConfirmTrip(){
  const id = getCookie('tripId');
  window.Uplift.Agent.confirmTrip(id,['']);
}

function upCancelTrip(){
  const id = getCookie('tripId');
  window.Uplift.Agent.cancelTrip(id);
  setCookie('tripId',null,-1);
}

function upReportError(type, message){
  if(getCookie('tripId')){
    window.Uplift.Agent.error(
      getCookie('tripId'),
      type, // 'Missing Data', 'payment', 'inventory', 'fatal'
      message // Message shown to the user
    );
  }
}

// ---- UTILS ---------------

function formatDate(date){
   var newDate = new Date(date);
   newDate = newDate.getFullYear().toString()
             + newDate.getMonth().toString()
             + newDate.getDate().toString();
   return newDate;
}
 
function setCookie(cname, cvalue, exdays) {
   var d = new Date();
   d.setTime(d.getTime() + (exdays*24*60*60*1000));
   var expires = "expires="+ d.toUTCString();
   document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
   var name = cname + "=";
   var decodedCookie = decodeURIComponent(document.cookie);
   var ca = decodedCookie.split(';');
   for(var i = 0; i <ca.length; i++) {
     var c = ca[i];
     while (c.charAt(0) == ' ') {
       c = c.substring(1);
     }
     if (c.indexOf(name) == 0) {
       return c.substring(name.length, c.length);
     }
   }
   return "";
}