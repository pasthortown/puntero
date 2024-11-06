import asyncio
import websockets
import json
from aiohttp import web

async def handle_connection(websocket, path):
    print("Cliente conectado")
    try:
        async for message in websocket:
            try:
                data = json.loads(message)
                x = data.get("x")
                y = data.get("y")
                z = data.get("z")
                print(f"Recibido - x: {x}, y: {y}, z: {z}")
            except json.JSONDecodeError:
                print("Error: El mensaje recibido no es un JSON válido")
    except websockets.exceptions.ConnectionClosed as e:
        print("Cliente desconectado", e)

async def handle_rest_request(request):
    boton = request.match_info.get('boton', "default")
    valor = request.match_info.get('valor', "default")
    print(f"Solicitud REST recibida - botón: {boton}, valor: {valor}")
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
