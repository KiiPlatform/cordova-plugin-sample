/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
 var kii;

 var onLogin = function (){
   var email = document.getElementById("email").value;
   var password = document.getElementById("password").value;
   kii.KiiUser.authenticate(email, password, {
       success: function (theUser) {
          // hide login table
          document.getElementById("login_table").setAttribute('style','display:none;');
          document.getElementById("loggedin_table").setAttribute('style','display:initial;');
          pushRegister();
       },
       failure: function (theUser, errorString) {
         alert("Error authenticating: " + errorString);
       }
   });
 };

 var onSignup = function (){
   var email = document.getElementById("email").value;
   var password = document.getElementById("password").value;
   var user = kii.KiiUser.userWithEmailAddress(email, password);
   user.register({
      success: function(theAuthenticatedUser) {
        // hide login table
        document.getElementById("login_table").setAttribute('style','display:none;');
        document.getElementById("loggedin_table").setAttribute('style','display:initial;');
        pushRegister();
      },
      failure: function(theUser, anErrorString) {
        alert("Error authenticating: " + anErrorString);
      }
  });

 };

 var pushRegister = function (){

    window.kiiPush.register(kii, {
       received: "pushReceived",
       success: function (token) {
           alert('token=' + token);
       },
       failure: function (msg) {
           alert('error ' + msg);
       }
    });
 };

 var onLogout = function (){
   kii.KiiUser.logOut();
   // hide login table
   document.getElementById("login_table").setAttribute('style','display:initial;');
   document.getElementById("loggedin_table").setAttribute('style','display:none;');
 };

 var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {

        if(id === 'deviceready') {
          document.getElementById("loginBtn").onclick = onLogin;
          document.getElementById("logoutBtn").onclick = onLogout;
          document.getElementById("signupBtn").onclick = onSignup;
          kii = window.kii.create();

          // replace APP_ID, APP_KEY, and KII_SITE with appropriate values
          kii.Kii.initializeWithSite(APP_ID, APP_KEY, KII_SITE);

          // replace sender_id with appropriate value
          window.kiiPush.initAndroid("sender_id", "pushReceived", {
              user: {
                  ledColor: "#FFFF00FF",
                  notificatonText: "user"
              },
              direct: {
                  showInNotificationArea: true,
                  ledColor: "#FFFFFFFF",
                  notificatonTitle: "$.title",
                  notificatonText: "$.msg"
              },
              success: function () {
                  console.log('init done');
              },
              failure: function (msg) {
                  console.log('error ' + msg);
              }
          });
        }
    }
 };

 function pushReceived(args) {
    alert('push received:'+JSON.stringify(args));
 }

 app.initialize();
