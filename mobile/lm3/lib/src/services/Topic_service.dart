import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

import 'package:lm3/src/bloc/user/user_bloc.dart';

import '../models/topic.dart';

class TopicService {
  final storage = new FlutterSecureStorage();
  final UserBloc userBloc;
  var baseUrl = 'https://anthologia-xwv6huylia-ew.a.run.app';
  // var baseUrl = 'http://20.13.168.88:3000';

  TopicService({required this.userBloc});

  Future<List<TopicModel>> getTopics() async {
    var token = userBloc.state.user?.token;
    var url = Uri.parse('${baseUrl}/topics');
    var response = await http.get(
      url,
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer $userBloc.state.user?.token"
      }
    );
   if (response.statusCode == 200) {
      Iterable jsonResponse = json.decode(response.body);
      List<TopicModel> topicList = [];
      for (var topic in jsonResponse) {
        try {
          print('Processing article: $topic');
          topicList.add(TopicModel.fromJson(topic));
        } catch (e, stackTrace) {
          print('Error parsing article: $e');
          print(stackTrace);
        }
      }
      print(topicList);
      return topicList;
    } else {
      throw Exception('Impossible de recuperer les articles');
    }
  }

  Future<dynamic> createTopic(String email, String username, String password) async {
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
