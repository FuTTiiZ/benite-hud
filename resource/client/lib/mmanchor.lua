--[[
    MINIMAP ANCHOR BY GLITCHDETECTOR (Feb 16 2018 version) (Dec 8 2023 edit by FuTTiiZ)
    Modify and redistribute as you please, just keep the original credits in.
    You're free to distribute this in any project where it's used.

    Jan 19 2025 NOTE BY FuTTiiZ:
    This is a flawed old method of getting the minimap screen position,
    this WILL cause issues on unconventional screen resolutions.
]]

--[[
    Returns a Minimap object with the following details:
    x, y: Top left origin of minimap
    width, height: Size of minimap (not pixels!)
    leftX, rightX: Left and right side of minimap on x axis
    topY, bottomY: Top and bottom side of minimap on y axis
]]
function GetMinimapAnchor()
  -- Safezone goes from 1.0 (no gap) to 0.9 (5% gap (1/20))
  -- 0.05 * ((safezone - 0.9) * 10)
  local safezone<const> = GetSafeZoneSize()
  local safezoneX<const> = 1.0 / 20.0
  local safezoneY<const> = 1.0 / 20.0
  local aspectRatio<const> = GetAspectRatio(false)
  local resX<const>, resY<const> = GetActiveScreenResolution()
  local xScale<const> = 1.005 / resX
  local yScale<const> = 1.0 / resY
  local Minimap<const> = {}
  Minimap.width = xScale * (resX / (4 * aspectRatio))
  Minimap.height = yScale * (resY / 5.674)
  Minimap.leftX = xScale * (resX * (safezoneX * ((math.abs(safezone - 1.0)) * 10)))
  Minimap.bottomY = 1.0 - yScale * (resY * (safezoneY * ((math.abs(safezone - 1.0)) * 10)))
  Minimap.rightX = Minimap.leftX + Minimap.width
  Minimap.topY = Minimap.bottomY - Minimap.height
  Minimap.x = Minimap.leftX
  Minimap.y = Minimap.topY
  Minimap.xUnit = xScale
  Minimap.yUnit = yScale
  return Minimap
end

--[[
Calculations I made while researching this:

Resolution: 2560x1440: (16:9 | 1,778)
Minimap: 360x256 = 7,111 x 5,625 (14,063% x 17,778%)
Safezone 0.90 = 128x73 = 20 x 19,726 (5% x 5,069%)
Safezone 0.95 = 64x37 = 40 x 38,919 (2,5% x 2,569%)
Safezone 1.00 = 0x0 = 0 x 0 (0% x 0%)
Minimap width / Aspect ratio = ~4

Resolution: 1280x960: (4:3 | 1,333)
Minimap: 240x170 = 5,333 x 5,647 (18,751% x 17,809%)
Safezone 0.90 = 64x48 = 20 x 20 = (5% x 5%)
Minimap width / Aspect ratio = ~4

Minimap width divided by aspect ratio is always ~4
Minimap height seems to be around ~17,8% of screen height
Safezone seems to be 5% of screen size per -0.10 safezone setting

THIS IS NOT TESTED ON ANYTHING WIDER THAN 16:10
I HAVE ABSOLUTELY NO IDEA WHAT THE NATIVES RETURN ON MULTI MONITOR SETUPS (3*1920 x 1080p etc.)
]]