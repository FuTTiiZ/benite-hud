---@type number | nil
local minimap = nil

CreateThread(function()
  minimap = RequestScaleformMovie('minimap')

  -- Refresh scaleform
  SetRadarBigmapEnabled(true, false)
  repeat Wait(0) until IsBigmapActive()
  SetRadarBigmapEnabled(false, false)

  --[[ BeginScaleformMovieMethod(minimap, 'GET_SIZE')
  local _size = EndScaleformMovieMethodReturnValue()
  repeat Wait(0) until IsScaleformMovieMethodReturnValueReady(_size)
  local size = GetScaleformMovieMethodReturnValueInt(_size)
  print(size) ]]

  SetBlipAlpha(GetNorthRadarBlip(), 0)
end)

local lastDraw = false

local lastX, lastY, lastWidth, lastHeight = 0, 0, 0, 0

---Hides default minimap components and draws minimap border
function DrawMinimap()
  if not minimap then return end

  BeginScaleformMovieMethod(minimap, 'SETUP_HEALTH_ARMOUR')
    ScaleformMovieMethodAddParamInt(3)
  EndScaleformMovieMethod()

  local x, y, width, height in GetMinimapAnchor()
    local draw =  (
    IsMinimapRendering() and
    not IsRadarHidden() and
    not IsPauseMenuActive() and
    not IsBigmapActive()
  )

  if
    draw ~= lastDraw
    or x ~= lastX
    or y ~= lastY
    or width ~= lastWidth
    or height ~= lastHeight
  then
    SendReactMessage('updateMinimap', {
      data = {
        x = x,
        y = y,
        width = width,
        height = height
      },
      draw = (
        IsMinimapRendering() and
        not IsRadarHidden() and
        not IsPauseMenuActive() and
        not IsBigmapActive()
      )
    })
  end
end