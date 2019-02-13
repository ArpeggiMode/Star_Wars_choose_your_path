$(document).ready(function() {

    var characters = {
      "Obi-Wan Kenobi": {
        name: "Obi-Wan Kenobi",
        health: 200,
        attack: 11,
        imageUrl: "assets/images/obi-wan.jpg",
        retaliateDamage: 10
      },
      "Anakin Skywalker": {
        name: "Anakin Skywalker",
        health: 100,
        attack: 14,
        imageUrl: "assets/images/anakin-skywalker.jpg",
        retaliateDamage: 10
      },
      "Jar Jar Binks": {
        name: "Jar Jar Binks",
        health: 150,
        attack: 8,
        imageUrl: "assets/images/jar-jar.jpg",
        retaliateDamage: 10
      },
      "Mace Windu": {
        name: "Mace Windu",
        health: 180,
        attack: 10,
        imageUrl: "assets/images/mace-windu.jpg",
        retaliateDamage: 10
      },
      "Yoda": {
        name: "Yoda",
        health: 200,
        attack: 12,
        imageUrl: "assets/images/yoda.jpg",
        retaliateDamage: 12
      }
    };
  
    var attacker;
    var combatants = [];
    var defender;
    var turnCounter = 1;
    var killStreak = 0;
  
    var renderCharacter = function(character, renderArea) {

      var charDiv = $("<div class='character' data-name='" + character.name + "'>");
      var charName = $("<div class='character-name'>").text(character.name);
      var charImage = $("<img alt='image' class='character-image'>").attr("src", character.imageUrl);
      var charHealth = $("<div class='character-health'>").text(character.health);
      charDiv.append(charName).append(charImage).append(charHealth);
      $(renderArea).append(charDiv);
    };
  
    var beginGame = function() {
      for (var key in characters) {
        renderCharacter(characters[key], "#characters-section");
      }
    };
  
    beginGame();
  
    var updateCharacter = function(charObj, areaRender) {
      $(areaRender).empty();
      renderCharacter(charObj, areaRender);
    };
  

    var renderEnemies = function(enemyArr) {
      for (var i = 0; i < enemyArr.length; i++) {
        renderCharacter(enemyArr[i], "#available-to-attack-section");
      }
    };
  
    var renderMessage = function(message) {
      var gameMessageSet = $("#game-message");
      var newMessage = $("<div>").text(message);
      gameMessageSet.append(newMessage);
    };
  
    var restartGame = function(resultMessage) {
      var restart = $("<button>Restart</button>").click(function() {
        location.reload();
      });

      var gameState = $("<div>").text(resultMessage);
  
      $("body").append(gameState);
      $("body").append(restart);
    };

    var clearMessage = function() {
      var gameMessage = $("#game-message");
  
      gameMessage.text("");
    };

    $("#characters-section").on("click", ".character", function() {
      var name = $(this).attr("data-name");
        if (!attacker) {
        attacker = characters[name];
        for (var key in characters) {
          if (key !== name) {
            combatants.push(characters[key]);
          }
        }
  
        $("#characters-section").hide();
  
        updateCharacter(attacker, "#selected-character");
        renderEnemies(combatants);
      }
    });
  
    $("#available-to-attack-section").on("click", ".character", function() {
      var name = $(this).attr("data-name");
  
      if ($("#defender").children().length === 0) {
        defender = characters[name];
        updateCharacter(defender, "#defender");
  
        $(this).remove();
        clearMessage();
      }
    });
  
    $("#attack-button").on("click", function() {
      if ($("#defender").children().length !== 0) {
        var attackMessage = "You attacked " + defender.name + " for " + attacker.attack * turnCounter + " damage.";
        var counterAttackMessage = defender.name + " attacked you back for " + defender.retaliateDamage + " damage.";
        clearMessage();
  
        defender.health -= attacker.attack * turnCounter;
  
        if (defender.health > 0) {
          updateCharacter(defender, "#defender");
            renderMessage(attackMessage);
          renderMessage(counterAttackMessage);
  
          attacker.health -= defender.retaliateDamage;
  
          updateCharacter(attacker, "#selected-character");
  
          if (attacker.health <= 0) {
            clearMessage();
            restartGame("You have been defeated... And so the light prevails.");
            $("#attack-button").off("click");
          }
        }
        else {
          $("#defender").empty();
  
          var gameStateMessage = "You have defeated " + defender.name + ", you can choose to fight another foe.";
          renderMessage(gameStateMessage);
  
          killStreak++;
  
          if (killStreak >= combatants.length) {
            clearMessage();
            $("#attack-button").off("click");
            restartGame("You revel in power as the cold advance of the dark side chill your veins. Not a single soul is left in the wake of the horror you have wrought. Could all of them really be dead?");
          }
        }
        turnCounter++;
      }
      else {
        clearMessage();
        renderMessage("You grow in power, but others will stand in your way. They must be dealt with.");
      }
    });
  });
  