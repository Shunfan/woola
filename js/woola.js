Woola = Ember.Application.create();

Woola.Router.map(function() {
  this.route("account");
  this.route("login");
  this.route("register");
});

// Index Handlers
Woola.IndexRoute = Ember.Route.extend({
  model: function() {
    return {
      title: "Woola",
      username: $.cookie("username"),
      token: $.cookie("token")
    }
  }
});

Woola.IndexView = Ember.View.extend({
  layoutName: "layout"
});

Woola.IndexController = Ember.ObjectController.extend({
  slugPost: function() {
    var controller = this;

    var url = controller.get("url");

    $.ajax({
      type: "POST",
      url: "http://127.0.0.1:9292/slugs",
      data: {
        url: url
      },
      success: function(response) {
        if (response.message) {
          console.log(response)
        } else {
          controller.set("url", "http://127.0.0.1/" + response.slug)
        }
      }
    })
  }
});

// Account Handlers
Woola.AccountRoute = Ember.Route.extend({
  redirect: function() {
    if (!$.cookie("token")) {
      this.transitionTo("login")
    }
  },

  model: function() {
    return {
      title: "My Account",
      username: $.cookie("username"),
      email: $.cookie("email"),
      token: $.cookie("token")
    }
  }
});

Woola.AccountView = Ember.View.extend({
  layoutName: "layout"
});

Woola.AccountController = Ember.ObjectController.extend({
  modifyInfo: function() {
    var controller = this;

    // Destroy former messages
    controller.set("error_info");
    controller.set("success_info");

    var token = $.cookie("token");
    var password = controller.get("password_info");
    var username = controller.get("username");
    var email = controller.get("email");

    if (token && password && username && email) {
      $.ajax({
        type: "PATCH",
        url: "http://127.0.0.1:9292/users",
        data: {
          token: token,
          password: password,
          username: username,
          email: email
        },
        success: function(response) {
          if (response.message) {
            controller.set("error_info", response.message)
          } else {
            controller.set("password_info");

            if (response.username) {
              $.cookie("username", response.username);
              controller.set("username", response.username)
            };

            if (response.email) {
              $.cookie("email", response.email);
              controller.set("email", response.email)
            };

            controller.set("success_info", "Successfully modified your information")
          }
        }
      })
    }
  },

  changePassword: function() {
    var controller = this;

    // Destroy former messages
    controller.set("error_pw");
    controller.set("success_pw");

    var token = $.cookie("token");
    var password = controller.get("password_pw");
    var new_password = controller.get("new_password");

    if (token && password && new_password) {
      $.ajax({
        type: "PATCH",
        url: "http://127.0.0.1:9292/users",
        data: {
          token: token,
          password: password,
          new_password: new_password
        },
        success: function(response) {
          if (response.message) {
            controller.set("error_pw", response.message)
          } else {
            controller.set("password_pw");
            controller.set("success_pw", "Successfully changed your password")
          }
        }
      })
    }
  },

  regenerate: function() {
    var controller = this;

    // Destroy former messages
    controller.set("error_at");
    controller.set("success_at");

    var token = $.cookie("token");
    var password = controller.get("password_at");

    if (token && password) {
      $.ajax({
        type: "PUT",
        url: "http://127.0.0.1:9292/users/token",
        data: {
          token: token,
          password: password
        },
        success: function(response) {
          if (response.message) {
            controller.set("error_at", response.message)
          } else {
            $.cookie("token", response.token);
            controller.set("password_at");
            controller.set("token", response.token);

            controller.set("success_at", "Successfully regenerated your token")
          }
        }
      })
    }
  },

  logout: function() {
    $.removeCookie("username");
    $.removeCookie("email");
    $.removeCookie("token");
    this.transitionToRoute("login")
  }
});

// Login Handlers
Woola.LoginRoute = Ember.Route.extend({
  redirect: function() {
    if ($.cookie("token")) {
      this.transitionTo("index")
    }
  },

  model: function() {
    return {
      title: "Welcome Back",
      token: $.cookie("token")
    }
  }
});

Woola.LoginView = Ember.View.extend({
  layoutName: "layout"
});

Woola.LoginController = Ember.ObjectController.extend({
  userGet: function() {
    var controller = this;

    controller.set("error_message"); // Destroy the former error message if exists.

    var account = controller.get("account");
    var password = controller.get("password");

    if (account && password) {
      $.ajax({
        type: "GET",
        url: "http://127.0.0.1:9292/users",
        data: {
          account: account,
          password: password
        },
        success: function(response) {
          if (response.message) {
            controller.set("error_message", response.message)
          } else {
            controller.saveUserInfo(response);
            controller.loginApproved()
          }
        }
      })
    }
  },

  saveUserInfo: function(info) {
    $.cookie("username", info.username)
    $.cookie("email", info.email)
    $.cookie("token", info.token)
  },

  loginApproved: function(){
    this.transitionToRoute('account')
  }
});

// Register Handlers
Woola.RegisterRoute = Ember.Route.extend({
  redirect: function() {
    if ($.cookie("token")) {
      this.transitionTo("index")
    }
  },

  model: function() {
    return {
      title: "Join Woola",
      token: $.cookie("token")
    }
  }
});

Woola.RegisterView = Ember.View.extend({
  layoutName: "layout"
});

Woola.RegisterController = Ember.ObjectController.extend({
  userPost: function() {
    var controller = this;

    controller.set("error_message"); // Destroy the former error message if exists.

    var username = controller.get("username");
    var email = controller.get("email");
    var password = controller.get("password");

    if (username && email && password) {
      $.ajax({
        type: "POST",
        url: "http://127.0.0.1:9292/users",
        data: {
          username: username,
          email: email,
          password: password
        },
        success: function(response) {
          if (response.message) {
            controller.set("error_message", response.message)
          } else {
            controller.transitionToRoute("login")
          }
        }
      })
    }
  }
});
