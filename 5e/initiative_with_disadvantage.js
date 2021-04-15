// Initiative with Disadvantage by Nulmas#9462
// Thanks to Freeze#2689, vance#1935 and u/Azzu for the help.

// This macro allows GMs and players to roll for Initiative with disadvantage when playing D&D 5e. Hopefully it won't be needed for long and the option for it will be added 
// to the system in a future release.

// The macro will roll for all the selected tokens and add them to the combat if they aren't in it already. It will also check if you are using Dex as a tiebreaker and roll
// accordingly.

// BEWARE: If a token has already rolled for initiative and you use this macro with it selected, the new initiative will replace the old one. I considered changing this, but
// decided it's worth keeping it this way in case a player or GM rolls for initiative without disadvantage by mistake.

(async function ()
{
if (canvas.tokens.controlled.length === 0)
    ui.notifications.error("Choose tokens to roll for");

else
    {
    await canvas.tokens.toggleCombat();
    let chosenTokens = canvas.tokens.controlled;
    let initiatives = null;
    let tieBreakerCheck = game.settings.get("dnd5e", "initiativeDexTiebreaker"); //Checks if Dex tiebreaker is being used
    
    if(tieBreakerCheck) //If tiebreaker is used
    {
        initiatives = chosenTokens.map(t => {
        let chosenActor =t.actor;
        let init = chosenActor.data.data.attributes.init.total;
        let tieBreaker = chosenActor.data.data.abilities.dex.value/100;
        let roll = new Roll(`2d20kl + ${init} + ${tieBreaker}`).roll();
        roll.toMessage({speaker: ChatMessage.getSpeaker({actor:chosenActor})});
        let combatantId = game.combat.combatants.find(c => c.name === chosenActor.name)._id;
        
        return {
            _id: combatantId,
            initiative: roll.total,
        };
    }) ;
    }
    
    else //if tiibreaker isn't used
    {
        initiatives = chosenTokens.map(t => {
        let chosenActor =t.actor;
        let init = chosenActor.data.data.attributes.init.total;
        let roll = new Roll(`2d20kl + ${init}`).roll();
        roll.toMessage({speaker: ChatMessage.getSpeaker({actor:chosenActor})});
        let combatantId = game.combat.combatants.find(c => c.name === chosenActor.name)._id;
        
        return {
            _id: combatantId,
            initiative: roll.total,
        };
    }) ;
    }
    initiatives.forEach(i => game.combat.updateCombatant(i));
    }
})();