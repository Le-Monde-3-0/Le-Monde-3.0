import 'package:flutter/material.dart';
import '../services/Article_service.dart';
import '../models/user.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'dart:convert';
import '../models/article_input.dart';

import 'package:lm3/src/bloc/user/user_bloc.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

class ArticleDetailPrevisuPage extends StatelessWidget {
  late final ArticleService _articleService;
  final ArticleInputModel article;
  final storage = new FlutterSecureStorage();

  ArticleDetailPrevisuPage({required this.article});

  Future<UserModel?> getUser() async {
    String? userJson = await storage.read(key: 'user');
    if (userJson == null) {
      return null;
    }
    Map<String, dynamic> userMap = jsonDecode(userJson);
    return UserModel.fromJson(userMap);
  }

  void _submitArticle(BuildContext context, ArticleInputModel article) async {
    try {
      final userBloc = BlocProvider.of<UserBloc>(context);
      var result = await ArticleService(userBloc: userBloc).createArticle(article);
    } catch (e) {
      print(e.toString());
    }
  }

  @override
  Widget build(BuildContext context) {
    return FutureBuilder<UserModel?>(
      future: getUser(),
      builder: (BuildContext context, AsyncSnapshot<UserModel?> snapshot) {
        if (snapshot.connectionState == ConnectionState.waiting) {
          return Center(child: CircularProgressIndicator());
        } else if (snapshot.hasError) {
          return Center(child: Text('Error: ${snapshot.error}'));
        } else if (!snapshot.hasData || snapshot.data == null) {
          return Center(child: Text('No user data available'));
        } else {
          final UserModel user = snapshot.data!;
          return Scaffold(
            appBar: AppBar(
            title: Text(
              article.topic.toString(),
              style: TextStyle(
                fontSize: 10, 
              ),
            ),
            actions: [
              IconButton(
                icon: Icon(Icons.close),
                onPressed: () => Navigator.of(context).pop(),
              ),
            ],
          ),
          body: SingleChildScrollView(
            padding: EdgeInsets.all(16.0),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: <Widget>[
                Text(
                  article.title,
                  style: TextStyle(
                    fontSize: 24.0,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                SizedBox(height: 8.0),
                Text(
                  user.username,
                  style: TextStyle(
                    fontSize: 18.0,
                    color: Colors.grey[600],
                  ),
                ),
                SizedBox(height: 16.0),
                Text(
                  article.content,
                  style: TextStyle(
                    fontSize: 16.0,
                  ),
                ),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    SizedBox(
                      height: 60,
                      child: ElevatedButton(
                        onPressed: () {
                          article.draft = true;
                          _submitArticle(context, article);
                          Navigator.of(context).pop();
                        },
                        style: ElevatedButton.styleFrom(
                          backgroundColor: Color.fromARGB(255, 80, 80, 80),
                          foregroundColor: Colors.white,
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(8),
                          ),
                        ),
                        child: const Text('Brouillon'),
                      ),
                    ),
                    SizedBox(
                      height: 60,
                      child: ElevatedButton(
                        onPressed: () {
                          article.draft = false;
                          _submitArticle(context, article);
                          Navigator.of(context).pop();
                        },
                        style: ElevatedButton.styleFrom(
                          backgroundColor: Color.fromARGB(255, 112, 243, 121),
                          foregroundColor: Colors.white,
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(8),
                          ),
                        ),
                        child: const Text('Publier'),
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
        );
      }
    }
  );
  }
}