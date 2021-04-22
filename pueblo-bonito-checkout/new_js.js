window.upReady = function(){
   console.log('up Ready');
   window.Uplift.Agent.init(getInitConfig());

   // Retrieve trip information
   const tripInfo = getTripInfo();

   console.log(tripInfo);

   const tripId = null;
   if (tripId) {
     window.Uplift.Agent.updateTrip(tripId, tripInfo); 
   } else {
     const tripId = getTripId();
     window.Uplift.Agent.createTrip(tripInfo); 
   }
 }

 function formatDate(date){
   var newDate = new Date(date);
   newDate = newDate.getFullYear().toString()
             + newDate.getMonth().toString()
             + newDate.getDate().toString();
   return newDate;
 }

 function getInitConfig(){
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
       console.log('On Change: '+tripOffer.status);
       return;
     },
     sessionTokenCallback: function(token){
       return 'asdf';
     },
     payMonthlyContainer: '#up-pay-monthly-container',
     checkout: true
   }
   return config;
 }

 function getTripInfo(){
   var total = parseFloat($("#TotalDue").val()).toFixed(2);
   total = parseInt(total.replace('.',''));
   var travelers = [
     {
       id: 0,
       first_name: $("#fname1").val(),
       last_name: $("#lname1").val()
     },
     {
       id: 1,
       first_name: $("#fname2").val(),
       last_name: $("#fname2").val()
     },
   ];
   var billing_contact = {
     first_name: $("#fname1").val(),
     last_name: $("#lname1").val()
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
   return 12341234;
 }