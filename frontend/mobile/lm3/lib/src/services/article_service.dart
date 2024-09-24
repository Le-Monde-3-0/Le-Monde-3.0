import 'dart:convert';
// import 'dart:ffi';
import 'package:http/http.dart' as http;
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

class ArticleService {
  final storage = new FlutterSecureStorage();

  Future<dynamic> createArticle(String authorname, String content, String subtitle, String title, String topic, bool draft) async {
    var token = await storage.read(key: "token");
    var url = Uri.parse('http://10.0.2.2:8080/articles');
    var body = json.encode({'authorname': authorname, 'content': content, 'draft': draft, 'subtitle': subtitle, 'title': title, 'topic': topic});

    var response = await http.post(
      url,
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer $token"
      },
      body: body
    );

    if (response.statusCode == 201) {
      return json.decode(response.body);
    } else {
      throw Exception('Failed to create article: ${response.body}');
    }
  }

  Future<dynamic> getArticle() async {
    var token = await storage.read(key: "token");
    var url = Uri.parse('http://10.0.2.2:8080/articles');

    var response = await http.get(
      url,
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer $token"
      }
    );

    if (response.statusCode == 200) {
      return json.decode(response.body);
    } else {
      throw Exception('Failed to create article: ${response.body}');
    }
  }

  Future<dynamic> getMyArticle() async {
    var token = await storage.read(key: "token");
    var url = Uri.parse('http://10.0.2.2:8080/articles/me');

    var response = await http.get(
      url,
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer $this.token"
      }
    );

    if (response.statusCode == 200) {
      return json.decode(response.body);
    } else {
      throw Exception('Failed to create article: ${response.body}');
    }
  }
}