import asyncio
import websockets
import json
from aiohttp import web
import pyautogui
from screeninfo import get_monitors

prev_horizontal = None
prev_vertical = None
data_timeout = 1

def get_total_screen_area():
    min_x = min(monitor.x for monitor in get_monitors())
    max_x = max(monitor.x + monitor.width for monitor in get_monitors())
    min_y = min(monitor.y for monitor in get_monitors())
    max_y = max(monitor.y + monitor.height for monitor in get_monitors())
    width_area = max_x - min_x
    height_area = max_y - min_y
    return width_area, height_area, min_x, min_y

def movePointer(vertical, horizontal):
    global prev_horizontal
    global prev_vertical
    
    width_area, height_area, min_x, min_y = get_total_screen_area()
    
    current_x, current_y = pyautogui.position()
    
    if prev_horizontal is None or prev_vertical is None:
        prev_horizontal = horizontal
        prev_vertical = vertical
        return
    
    horizontal_change = horizontal - prev_horizontal
    vertical_change = vertical - prev_vertical
    prev_horizontal = horizontal
    prev_vertical = vertical
    
    pixel_change_x = -(horizontal_change / 75) * width_area
    pixel_change_y = -(vertical_change / 25) * height_area
    
    new_x = max(min_x, min(current_x + pixel_change_x, min_x + width_area - 1))
    new_y = max(min_y, min(current_y + pixel_change_y, min_y + height_area - 1))
    pyautogui.moveTo(new_x, new_y)

def doAction(action):
    if action == "siguiente":
        pyautogui.press("right")
    elif action == "anterior":
        pyautogui.press("left")
    elif action == "presentar":
        pyautogui.press("f5")
    elif action == "apagar":
        pyautogui.press("esc")
    elif action == "click":
        pyautogui.click()
    elif action == "secondary_click":
        pyautogui.rightClick()
    else:
        print(f"Acción no reconocida: {action}")

async def reset_prev_values():
    global prev_horizontal
    global prev_vertical
    await asyncio.sleep(data_timeout)
    prev_horizontal = None
    prev_vertical = None

async def handle_connection(websocket, path):
    print("Cliente conectado")
    reset_task = asyncio.create_task(reset_prev_values())
    try:
        async for message in websocket:
            reset_task.cancel()
            reset_task = asyncio.create_task(reset_prev_values())
            try:
                data = json.loads(message)
                vertical = data.get("x")
                axial = data.get("y")
                horizontal = data.get("z")
                movePointer(vertical, horizontal)
            except json.JSONDecodeError:
                print("Error: El mensaje recibido no es un JSON válido")
    except websockets.exceptions.ConnectionClosed as e:
        print("Cliente desconectado", e)
    finally:
        reset_task.cancel()

async def handle_rest_request(request):
    boton = request.match_info.get('boton', "default")
    valor = request.match_info.get('valor', "default")
    print(f"Solicitud REST recibida - botón: {boton}, valor: {valor}")
    doAction(valor)
    return web.json_response({"boton": boton, "valor": valor})

async def main():
    ws_server = websockets.serve(handle_connection, "0.0.0.0", 6789)
    await ws_server
    print("Servidor WebSocket iniciado en ws://0.0.0.0:6789")

    app = web.Application()
    app.router.add_get('/{boton}/{valor}', handle_rest_request)
    runner = web.AppRunner(app)
    await runner.setup()
    rest_site = web.TCPSite(runner, "0.0.0.0", 8080)
    await rest_site.start()
    print("Servidor REST iniciado en http://0.0.0.0:8080")
    await asyncio.Future()

asyncio.run(main())
