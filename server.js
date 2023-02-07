import * as http from "http";

function doRequest(request) {
	let body = ''
	return new Promise((res, rej) => {
		request.on('data', (chunk) => {
			body += chunk;
		});
		request.on('end', () => {
			res((body));
		});
		request.on('error', (err) => {
			rej(err);
		});
	});
}

const port = process.env.PORT || 3001;
const requestHandler = function (req, res) {
	let data = null
	const r = doRequest(req)
	r.then(async c => {
		const o = JSON.parse(c)
		if (o.data === 'weather') {
			const f = fetch(
				`https://api.openweathermap.org/data/2.5/weather?q=${o.city}&appid=a1d7b55bf627b6db7643916254c70535&units=metric`,{
					headers: {'Access-Control-Allow-Origin':"*"}
				})
			return f.then(async a => {
				data = await a.json()
				return data
			})
		}
		else {
			const apiKey = '09cc073d99f843bd93b5e025c1adf603'
			const f = fetch(`https://api.ipgeolocation.io/ipgeo?apiKey=${apiKey}&lang=en`)
			f.then(async a => {
				const jsn = await a.json()
				res(jsn)
			})
		}
	}).then(r =>{
		console.log(data)
		res.setHeader("Access-Control-Allow-Origin", "*");
		res.setHeader("Access-Control-Allow-Credentials", "true");
		res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
		res.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");
		res.write(JSON.stringify(data))
		res.end()
	})
	//res.setHeader("Content-Type", "application/json");

	// 	case "/books":
	// 		res.writeHead(200);
	// 		res.end(books);
	// 		break
	// 	case "/authors":
	// 		res.writeHead(200);
	// 		res.end(authors);
	// 		break
	// 	default:
	// 		res.writeHead(404);
	// 		res.end(JSON.stringify({error:"Resource not found"}));
	// }
}
const server = http.createServer(requestHandler);
server.listen(port, () => {
	console.log(`server is listening on ${port}`);
});
