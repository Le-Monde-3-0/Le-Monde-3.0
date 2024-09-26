import 'dart:convert';
import 'package:flutter/services.dart';
import 'package:http/http.dart' as http;
import '../models/user.dart';

class AuthService {
  // var baseUrl = 'http://10.0.2.2:3000';
  var baseUrl = 'https://anthologia-xwv6huylia-ew.a.run.app';

  Future<UserModel> emailSignIn(String email, String password) async {
    var url = Uri.parse('${baseUrl}/authentication/sign-in');
    var body = json.encode({'email': email, 'password': password });
    print('body: $body');
    var response = await http.post(
      url,
      headers: {"Content-Type": "application/json"},
      body: body
    );
    print('response: ${response.body}');
    if (response.statusCode == 200) {
      String setCookieHeader = response.headers['set-cookie'] ?? '';
      RegExp refreshTokenRegExp = RegExp(r'refreshToken=([^;]+)');
      Match? match = refreshTokenRegExp.firstMatch(setCookieHeader);

      String? refreshToken = match?.group(1);
      print('refreshToken: $refreshToken');
      final Map<String, dynamic> userJsonMap = json.decode(response.body);
      UserModel user = UserModel.fromJson(userJsonMap);

      print('refreshToken: $refreshToken');
      user.updateToken(refreshToken!);
      return user;
    } else {
      throw Exception('Failed to login: ${response.body}');
    }
  }

  Future<dynamic> createUser(String email, String username, String password) async {
    var url = Uri.parse('${baseUrl}/authentication/sign-up');
    var body = json.encode({'email': email,
                             'username': username,
                             'password': password }); 
  
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
}
