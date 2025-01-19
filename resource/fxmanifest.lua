fx_version 'cerulean'
game 'gta5'

description 'Benite HUD'
author 'FuTTiiZ'
version '1.2.6'

-- Lua 5.4
lua54 'yes'

shared_scripts {
  '@es_extended/imports.lua',
  'config.lua',
}

server_scripts {
  'server/main.lua'
}

client_scripts {
  'client/lib/mmanchor.lua',
  'client/minimap.lua',
  'client/main.lua',
}

files {
  'client/nui/index.html',
  'client/nui/**/*'
}

ui_page 'client/nui/index.html'

escrow_ignore {
  'config.lua'
}

dependencies {
  'es_extended',
  'esx_status',
  'esx_basicneeds',
}