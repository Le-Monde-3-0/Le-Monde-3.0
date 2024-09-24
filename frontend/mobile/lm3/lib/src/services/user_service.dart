import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:shared_preferences/shared_preferences.dart';

class UserService {
  final storage = FlutterSecureStorage();
   final http.Client client;

  UserService({http.Client? client}) : client = client ?? http.Client();

  Future<dynamic> login(String email, String password) async {
    var url = Uri.parse('http://10.0.2.2:8081/login');
    var body = json.encode({'Email': email, 'Password': password });
    var response = await http.post(
      url,
      headers: {"Content-Type": "application/json"},
      body: body
    );

    if (response.statusCode == 200) {
      var data = json.decode(response.body);
      await storage.write(key: 'token', value: data['token']);
      return data;
    } else {
      throw Exception('Failed to login: ${response.body}');
    }
  }
  
  Future<dynamic> createUser(String email, String username, String password) async {
    var url = Uri.parse('http://10.0.2.2:8081/register');
    var body = json.encode({'Email': email,
                             'Username': username,
                             'Password': password });

    var response = await http.post(
      url,
      headers: {"Content-Type": "application/json"},
      body: body
    );
    if (response.statusCode == 200) {
      return json.decode(response.body);
    } else {
      throw Exception('Failed to create user: ${response.body}');
    }
  }

  Future<String?> getToken() async {
    return await storage.read(key: 'token');
  }
}
