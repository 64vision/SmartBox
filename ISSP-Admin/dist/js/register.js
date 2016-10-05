 $(function () {
       var validated;
         $('.errorMessage').hide();

       $('#LoginBtn').on('click', function() {
           
           var _params = {};
              _params.username = $('#username').val();
              _params.password= $('#password').val();
              var $btn = $('.btn').button('loading');
              $.post('http://prod.inventiv.ph/user/login', _params, function(res) {
                var  obj = JSON.parse(res);
                console.log(obj);
                if(obj.status ==1) {
                   sessionStorage.Auth = res;
                   window.location.assign("profile.html")
                } else {
                      $('.errorMessage').fadeIn();
                      $('.errorMessage').html('Invalid user cridentials!');
                      setTimeout(function() {
                           $('.errorMessage').hide();

                      }, 3000);
                }
               
                $btn.button('reset'); 
              });

              return false;
          });


       $('#SignUpBtn').on('click', function() {
          if($('#password').val() == $("#repassword").val()) {
             valEntry();
             if(validated) {
                  createUser();
              } else {
                $('.errorMessage').fadeIn();
                      $('.errorMessage').html('Complete the required fields!');
              }
            } else {
                      $('.errorMessage').fadeIn();
                      $('.errorMessage').html('Mismatch Password!');
            }
          

            return false;
      });

       $("#createaccount").on('click', function() {
          $("#createaccount, #LoginBtn").hide();
          $('.regform, #SignUpBtn').show();
           return false;
       });

       function valEntry() {
        validated = true;
        $( "._reg" ).each(function( index ) {
          console.log($(this).val());
           if(!$(this).val()) {
              validated = false;
            }
        });

        //return true;
       }


       function createUser() {
            var _params = {};
            _params.username = $('#username').val();
            _params.password= $('#password').val();
            _params.fullname= $('#fullname').val();
             _params.company= $('#company').val();
               _params.email= $('#email').val();
              _params.address= $('#address').val();
              _params.contact_number= $('#contact').val();
            _params.status = 101;
                $.post('http://prod.inventiv.ph/user/validate', _params, function(res) {
                       var  obj = JSON.parse(res);
                      console.log(obj);
                     if(obj.status ==101) {
                           $('.errorMessage').show();
                            $('.errorMessage').html('User already exist!');
                        
                      } else if(obj.status ==102){
                             $.post('http://prod.inventiv.ph/user/create', _params, function(res) {
                                  var  obj = JSON.parse(res);
                                   if(obj.status == 1) {
                                      alert('Account created!');
                                       $.post('http://prod.inventiv.ph/user/login', _params, function(res) {
                                         var  obj = JSON.parse(res);
                                         if(obj.status == 1) {
                                            sessionStorage.Auth = res;
                                             window.location.assign("profile.html")
                                         }
                                      });
                                   }
                               });
                      }
                     
               });
                setTimeout(function() {
                           $('.errorMessage').hide();

                      }, 3000);

       }///function end
  });