import 'dart:convert';
import 'package:http/http.dart' as http;

class UserService {
  var baseUrl = 'http://20.13.168.88';

  Future<dynamic> login(String identifier, String password) async {
    var url = Uri.parse('${baseUrl}:8081/login');
    var body = json.encode({'Identifier': identifier, 'Password': password });
    var response = await http.post(
      url,
      headers: {"Content-Type": "application/json"},
      body: body
    );
    if (response.statusCode == 200) {
      return json.decode(response.body);
    } else {
      throw Exception('Failed to login: ${response.body}');
    }
  }

  Future<dynamic> createUser(String email, String username, String password) async {
    var url = Uri.parse('${baseUrl}:8081/register');
    var boody = json.encode({'Email': email,
                             'Username': username,
                             'Password': password }); 
  
    var response = await http.post(
      url,
      headers: {"Content-Type": "application/json"},
      body: boody
    );
    if (response.statusCode == 200) {
      return json.decode(response.body);
    } else {
      throw Exception('Failed to create user: ${response.body}');
    }
  }
}
