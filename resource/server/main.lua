-- Update info
CreateThread(function()
  while true do
    local players<const> = GetPlayers()
    for _, source in ipairs(players) do
      TriggerClientEvent('benite-hud:client:receivePing', math.floor(tonumber(source) or 0), GetPlayerPing(source))
    end

    TriggerClientEvent('benite-hud:client:receivePlayerCount', -1, #players)

    Wait(2500)
  end
end)