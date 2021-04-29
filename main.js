// Requerir el interfaz http X
const http = require('http');

// Importar el cliente de MongoDB X
const MongoClient = require('mongodb').MongoClient;

// Definir el puerto a utilizar X
const port = 3000; 

// Especificar la URL de conexión por defecto al servidor local X
const url = 'mongodb://localhost:27017';

// Nombre de la base de datos a la que conectarse X
const dbName = 'nodejs-mongo';

// Crear una instancia del cliente de MongoDB X
const client = new MongoClient(url, {useNewUrlParser: true, useUnifiedTopology: true});

//Importar QueryString


// Crear el servidor y definir la respuesta que se le da a las peticiones X
const server = http.createServer((request, response) => {
    // Extrear el contenido de la petición X
    const { headers, method, url } = request;

    console.log('headers: ', headers);
    console.log('method: ', method);
    console.log('url: ', url);

    let body = [];

    request.on('error', (err) => {
            console.error(err);
        }).on('data', (chunk) => {
            // El cuerpo de la petición puede venir en partes, aquí se concatenan X
            body.push(chunk);
        }).on('end', () => {
            // El cuerpo de la petición está completo X
            body = Buffer.concat(body).toString();
            
            const querystring = require('querystring');
            // Definir documento con queryString X
            let document = querystring.decode(body);


            client.connect().then(async () => {
                //X
                const db = client.db(dbName);
            
                // Obtener la referencia a la colección  X
                const collection = db.collection('usuarios');
            
            
                // Llamar a la función para insertar
                const insertResult = await collection.insertOne(document);
            
                // Llamar a la función para recuperar
                let findResult = await collection.find({}).toArray();
            
            
              //  client.close();
        

            // Código de estado HTTP que se devuelve
            response.statusCode = 200;
            // Encabezados de la respuesta, json
            response.setHeader('Content-Type', 'application/json');

            response.write(JSON.stringify(findResult))
            // Contenido de la respuesta
            response.end(); 
            
        }).catch((error) => {
            console.log("Se produjo algún error en las operaciones con la base de datos: " + error);
            client.close();
        });
    });


});


// Ejecutar el servicio para que permanezca a la espera de peticiones
server.listen(port, () => {
    console.log('Servidor ejecutándose...');
    console.log('Abrir en un navegador http://localhost:3000');
});