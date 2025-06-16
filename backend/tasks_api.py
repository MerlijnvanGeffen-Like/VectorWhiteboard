import connexion
from create_db import main
from config import CONFIG

main()

app = connexion.FlaskApp(__name__)
app.add_api("openapi.yaml")
#app.run(host=CONFIG["server"]["listen_ip"], port=CONFIG["server"]["port"], debug=CONFIG["server"]["debug"])
app.run(host=CONFIG["server"]["listen_ip"], port=CONFIG["server"]["port"], debug=True)