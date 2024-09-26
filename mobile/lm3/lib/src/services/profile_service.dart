import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

import 'package:lm3/src/bloc/user/user_bloc.dart';

import '../models/topic.dart';

class ProfileService {
  final storage = new FlutterSecureStorage();
  final UserBloc userBloc;
  var baseUrl = 'https://anthologia-xwv6huylia-ew.a.run.app';
  // var baseUrl = 'http://20.13.168.88:3000';

  ProfileService({required this.userBloc});


  Future<String> changeUsername(String newUsername) async {
    var token = userBloc.state.user?.token;
    var url = Uri.parse('${baseUrl}/user/username');
    var body = json.encode({"newUsername": newUsername});
    var response = await http.patch(
      url,
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer $userBloc.state.user?.token",
        "Cookie": "jwt=$token"
      },
      body: body
    );
   if (response.statusCode == 200) {
      String jsonResponse = json.decode(response.body);
      print(jsonResponse);
      return jsonResponse;
    } else {
      print(response.body);
      throw Exception('Impossible de changer le nom d\'utilisateur');
    }
  }

  Future<String> changeEmail(String newEmail) async {
    var token = userBloc.state.user?.token;
    var url = Uri.parse('${baseUrl}/authentication/email');
    var body = json.encode({"newEmail": newEmail});
    var response = await http.patch(
      url,
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer $userBloc.state.user?.token",
        "Cookie": "jwt=$token"
      },
      body: body
    );
   if (response.statusCode == 200) {
      String jsonResponse = json.decode(response.body);
      print(jsonResponse);
      return jsonResponse;
    } else {
      throw Exception('Impossible de recuperer les articles');
    }
  }

  Future<String> changePassword(String oldPassword, String newPassword) async {
    var token = userBloc.state.user?.token;
    var url = Uri.parse('${baseUrl}/authentication/password');
    var body = json.encode({"oldPassword": oldPassword,
                            "newPassword": newPassword,
                            });
    var response = await http.patch(
      url,
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer $userBloc.state.user?.token",
        "Cookie": "jwt=$token"
      },
      body: body
    );
   if (response.statusCode == 200) {
      String jsonResponse = json.decode(response.body);
      print(jsonResponse);
      return jsonResponse;
    } else {
      throw Exception('Impossible de recuperer les articles');
    }
  }


}
