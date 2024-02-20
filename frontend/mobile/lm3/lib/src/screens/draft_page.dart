import 'package:flutter/material.dart';
import 'dart:convert';

import '../services/article_service.dart';
import '../models/article.dart';
import '../shared/article_widget.dart';

// Convertissez BrouillonsWidget en StatefulWidget
class BrouillonsWidget extends StatefulWidget {
  @override
  _BrouillonsWidgetState createState() => _BrouillonsWidgetState();
}

class _BrouillonsWidgetState extends State<BrouillonsWidget> {
  final ArticleService _articleService = ArticleService();
  late Future<List<ArticleModel>> futureArticles;

  @override
  void initState() {
    super.initState();
    futureArticles = _getArticle();
  }

  Future<List<ArticleModel>> _getArticle() async {
    try {
      var response = await _articleService.getMyArticle();
      Iterable jsonResponse = response;
      List<ArticleModel> articlesList = [];
        for (var article in jsonResponse) {
          if (article['Draft'] == true) {
            articlesList.add(ArticleModel.fromJson(article));
          }
      }
      return articlesList;
    } catch (e) {
      print(e.toString());
      return [];
    }
  }

  String _truncateWithEllipsis(String text, int cutoff) {
    return (text.length <= cutoff) ? text : '${text.substring(0, cutoff)}...';
  }

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      theme: ThemeData.dark(),
      home: Scaffold(
        appBar: AppBar(
          title: Text('Mes brouillons', style: TextStyle(fontFamily: 'LeMonde', fontSize: 30.0, fontWeight: FontWeight.bold, color: Colors.white)),
        ),
        body: Column(
          children: [
          SizedBox(width: 1106.0),
            Expanded(
              child: _buildArticlesList(),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildArticlesList() {
    return FutureBuilder<List<ArticleModel>>(
      future: futureArticles,
      builder: (context, snapshot) {
        if (snapshot.connectionState == ConnectionState.waiting) {
          return Center(child: CircularProgressIndicator());
        } else if (snapshot.hasError) {
          return Center(child: Text('Erreur: ${snapshot.error}'));
        } else if (snapshot.data!.isEmpty) {
          return Center(child: Text('Aucun article disponible.'));
        } else {
          List<ArticleModel> myObjects = snapshot.data ?? [];
          return ListView.builder(
            itemCount: myObjects.length,
            itemBuilder: (context, index) {
              return ArticleWidget(article: myObjects[index]);
            },
          );
        }
      },
    );
  }
}
