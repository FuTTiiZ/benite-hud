function SendReactMessage(action, data)
  SendNUIMessage({
    action = action,
    data = data
  })
end

RegisterNetEvent('benite-hud:client:receivePing', function(ping)
  SendReactMessage('updatePing', { ping = ping } )
end)

RegisterNetEvent('benite-hud:client:receivePlayerCount', function(count)
  SendReactMessage('updatePlayers', { count = count } )
end)

---@return boolean
local function isPauseMapOpen()
  local lastItemMenuId, selectedItemUniqueId = GetPauseMenuSelection()
  return IsPauseMenuActive() and lastItemMenuId == 0 and selectedItemUniqueId == 0
end

local seatbelt = false
---Handle seatbelt toggle
  ---@param on boolean
RegisterNetEvent('toggleSeatbelt', function(on)
  seatbelt = on
  SendReactMessage('updateSeatbelt', { belt = seatbelt })
end)

local function kmhToKnots(kph)
  return kph * 0.539957
end

local function mToFeet(m)
  return m * 3.28084
end

-- Toggle on foot minimap
if not Config.onlyMinimapInVehicles then
  RegisterCommand('onfootmap', function()
    Config.onlyMinimapInVehicles = not Config.onlyMinimapInVehicles
    SetResourceKvpInt('benite-hud:onlyMinimapInVehicles', Config.onlyMinimapInVehicles and 1 or 0)
  end, false)
  RegisterKeyMapping('onfootmap', 'Slå minimap til fods til/fra', 'keyboard', 'comma')
  Config.onlyMinimapInVehicles = GetResourceKvpInt('benite-hud:onlyMinimapInVehicles') == 1
end

-- Draw top-right info
RegisterCommand('+showserverinfo', function() SendReactMessage('updateInfo', { draw = true } ) end, false)
RegisterCommand('-showserverinfo', function() SendReactMessage('updateInfo', { draw = false } ) end, false)
RegisterKeyMapping('+showserverinfo', 'Vis server information øverst til højre', 'keyboard', 'tab')

local playerId<const> = PlayerId()
AddEventHandler('esx_status:onTick', function(data)
  local _, lungCapacity<const> = StatGetInt(`MP0_LUNG_CAPACITY`, 0)
  local maxUnderwaterTime<const> = 0.3 * lungCapacity + 10

  local status<const> = {
    hunger = 0,
    thirst = 0,
    lungs = GetPlayerUnderwaterTimeRemaining(playerId) / maxUnderwaterTime
  }

  for _, stat in ipairs(data) do
    if stat.name == Config.hungerStat then
      status.hunger = stat.percent / 100
    elseif stat.name == Config.thirstStat then
      status.thirst = stat.percent / 100
    end
  end

  SendReactMessage('updateStatus', status)
end)

-- Draw money
local drawAccounts = false
RegisterCommand('+showaccounts', function()
  drawAccounts = true
end, false)
RegisterCommand('-showaccounts', function()
  drawAccounts = false
end, false)
RegisterKeyMapping('+showaccounts', 'Vis penge', 'keyboard', 'period')

-- HUD Menu
local function getHUDConfig()
  local config<const> = {}

  -- Config booleans
  local configBooleans<const> = { 'stickyAccounts', 'stickyInfo', 'compass' }
  for _, key in ipairs(configBooleans) do
    config[key] = GetResourceKvpInt('benite-hud:' .. key) == 1
  end

  -- Config floats
  local configFloats<const> = { 'minimapOffsetX', 'minimapOffsetY' }
  for _, key in ipairs(configFloats) do
    config[key] = GetResourceKvpFloat('benite-hud:' .. key)
  end

  return config
end

local hudMenuOpen = false
local function closeConfigMenu()
  CreateThread(function()
    repeat Wait(0) until not IsScreenblurFadeRunning()

    hudMenuOpen = false
    TriggerScreenblurFadeOut(500.0)
    SetNuiFocus(false, false)
    SetNuiFocusKeepInput(false)
  end)
end
RegisterNUICallback('closeConfigMenu', function(body, cb)
  closeConfigMenu()
  cb('ok')
end)

RegisterCommand('hudmenu', function()
  if hudMenuOpen then
    SendReactMessage('updateConfigMenu', { draw = false })
    closeConfigMenu()
    return
  end
  hudMenuOpen = true

  CreateThread(function()
    repeat Wait(0) until not IsScreenblurFadeRunning()

    TriggerScreenblurFadeIn(500.0)
    SetNuiFocus(true, true)
    SetNuiFocusKeepInput(true)

    SendReactMessage('updateConfigMenu', {
      draw = true,
      config = getHUDConfig()
    })
  end)
end, false)
RegisterKeyMapping('hudmenu', 'Åben HUD menu', 'keyboard', 'm')

---@param data { key: string, value: boolean }
RegisterNUICallback('setConfigBool', function(data, cb)
  SetResourceKvpInt('benite-hud:' .. data.key, data.value and 1 or 0)
  cb('ok')
end)

---@param data { key: string, value: any }
RegisterNUICallback('setConfigFloat', function(data, cb)
  local value<const> = tonumber(data.value) or 0
  SetResourceKvpFloat('benite-hud:' .. data.key, value + 0.0)
  cb('ok')
end)

RegisterNUICallback('nuiReady', function(data, cb)
  Wait(5000)
  SendReactMessage('updateConfigMenu', {
    draw = false,
    config = getHUDConfig()
  })
  SendReactMessage('setupHUD', {
    color = Config.color or { 255, 255, 255 },
    logoUrl = Config.logoUrl or 'https://benite.xyz/assets/benite-logo.9233d4ca.svg',
  })
  cb('ok')
end)

Wait(5000) -- Wait for UI to 100% load

local playerPed, playerVehicle = PlayerPedId(), 0
local playerCoords = GetEntityCoords(playerPed)
local streetHash = GetStreetNameAtCoord(playerCoords.x, playerCoords.y, playerCoords.z)
CreateThread(function()
  while true do
    streetHash = GetStreetNameAtCoord(playerCoords.x, playerCoords.y, playerCoords.z)

    -- Accounts
    local accounts<const> = {
      [Config.cashAccount or 'money'] = 0,
      [Config.bankAccount or 'bank'] = 0,
      [Config.blackMoneyAccount or 'black_money'] = 0
    }

    if ESX?.PlayerData?.accounts then
      for _, account in ipairs(ESX.PlayerData.accounts) do
        if accounts[account.name] then
          accounts[account.name] = account.money
        end
      end

      SendReactMessage('updateAccounts', {
        accounts = accounts,
        draw = drawAccounts
      })
    end

    Wait(2000)
  end
end)


CreateThread(function()
  local lastStreetHash
  local lastPauseMapOpen
  local lastHealth = -1
  local lastArmor = -1
  local lastTalking = false

  while true do
    playerPed = PlayerPedId()
    playerVehicle = GetVehiclePedIsIn(playerPed, false)
    playerCoords = GetEntityCoords(playerPed)

    -- Hide default HUD
    HideHudComponentThisFrame(6) -- Vehicle name
    HideHudComponentThisFrame(7) -- Area name
    HideHudComponentThisFrame(3) -- Cash
    HideHudComponentThisFrame(4) -- Bank cash

    -- Minimap
    DisplayRadar(not (Config.onlyMinimapInVehicles and not IsPedInAnyVehicle(playerPed, false)))
    DrawMinimap()

    -- Location
    if streetHash ~= lastStreetHash then
      lastStreetHash = streetHash
      SendReactMessage('updateStreetName', { name = GetStreetNameFromHashKey(streetHash) } )
    end

    -- Pause map
    local pauseMapOpen<const> = isPauseMapOpen()
    if pauseMapOpen ~= lastPauseMapOpen then
      lastPauseMapOpen = pauseMapOpen
      SendReactMessage('updatePauseMapOpen', { open = pauseMapOpen } )
    end

    -- Health and armour
    local health<const> = GetEntityHealth(playerPed)
    local armor<const> = GetPedArmour(playerPed)
    if health ~= lastHealth or armor ~= lastArmor then
      lastHealth = health
      lastArmor = armor
      SendReactMessage('updateHealthArmor', {
        health = ESX.PlayerData.dead and 0 or math.floor((health - 100) / (GetEntityMaxHealth(playerPed) - 100) * 100),
        armor = armor
      })
    end

    -- Mic
    local talking<const> = MumbleIsPlayerTalking(playerId)
    if talking ~= lastTalking then
      lastTalking = talking
      SendReactMessage('updateMic', {
        active = talking,
        proximity = LocalPlayer.state.proximity?.mode or 'Normal'
      })
    end

    -- Config menu
    if hudMenuOpen then
      DisableControlAction(0, 1, true) -- Look LR
      DisableControlAction(0, 2, true) -- Look UP
      DisableControlAction(0, 24, true) -- Attack

      if
        IsControlJustPressed(0, 22) -- Jump
        or IsControlJustPressed(0, 202) -- Backspace / ESC
        or IsPauseMenuActive()
      then
        SendReactMessage('updateConfigMenu', { draw = false })
        closeConfigMenu()
      end
    end

    -- Compass
    SendReactMessage('updateCompass', {
      heading = GetEntityHeading(playerPed) + GetGameplayCamRelativeHeading(),
    })

    if playerVehicle and playerVehicle ~= 0 then -- In vehicle
      local vehicleType<const> = GetVehicleClass(playerVehicle)
      local drawCarHud<const> = (
        --vehicleType ~= 8  and -- not Motorcycle
        vehicleType ~= 13 and -- not Cycle
        vehicleType ~= 14 and -- not Boat
        vehicleType ~= 15 and -- not Helicopter
        vehicleType ~= 16 and -- not Plane
        vehicleType ~= 21 -- not Train
      )

      local windDirection<const> = GetWindDirection()
      local wind<const> = { x = windDirection.x, y = windDirection.y, speed = GetWindSpeed() }

      if drawCarHud then -- "Normal" vehicle hud
        SendReactMessage('updateSpeed', {
          speed = math.abs(math.ceil(GetEntitySpeed(playerVehicle) * 3.6)),
          maxSpeed = GetVehicleEstimatedMaxSpeed(playerVehicle) * 3.6,
          draw = true,
          drawBelt = (
            vehicleType ~= 8 -- not Motorcycle
          )
        })
      elseif
        vehicleType == 15 -- Helicopter
      then -- Vehicle hud using knots
        SendReactMessage('updateSpeed', {
          speed = math.ceil(kmhToKnots(GetEntitySpeed(playerVehicle) * 3.6)),
          altitude = mToFeet(playerCoords.z),
          wind = wind,
          rotorHealth = GetHeliMainRotorHealth(playerVehicle),
          tailHealth = GetHeliTailRotorHealth(playerVehicle),
          gear = DoesVehicleHaveLandingGear(playerVehicle) and GetLandingGearState(playerVehicle) or -1,
          heli = true,
          knots = true,
          draw = true,
        })
      elseif 
       vehicleType == 14 or -- Boat
       vehicleType == 16 -- Plane
      then
        SendReactMessage('updateSpeed', {
          speed = math.ceil(kmhToKnots(GetEntitySpeed(playerVehicle) * 3.6)),
          altitude = vehicleType == 16 and mToFeet(playerCoords.z) or nil,
          wind = wind,
          gear = DoesVehicleHaveLandingGear(playerVehicle) and GetLandingGearState(playerVehicle) or -1,
          rotorHealth = ArePlanePropellersIntact(playerVehicle),
          plane = vehicleType == 16,
          knots = true,
          draw = true,
        })
      end

      SendReactMessage('updateFuel', {
        fuel = GetVehicleFuelLevel(playerVehicle) / GetVehicleHandlingFloat(playerVehicle, 'CHandlingData', 'fPetrolTankVolume') * 100
      })
    else -- Not in vehicle
      if seatbelt then -- Reset seatbelt
        seatbelt = false
        SendReactMessage('updateSeatbelt', { belt = seatbelt })
      end
      SendReactMessage('updateSpeed', { draw = false })
    end

    
    Wait(0)
  end
end)