import 'package:flutter/material.dart';
import 'dart:convert';
import 'dart:math';
import 'package:heart_overlay/heart_overlay.dart';

import '../services/Article_service.dart';
import '../models/article.dart';
import '../shared/article_widget.dart';

class FavArticleWidget extends StatefulWidget {
  @override
  _FavArticleWidgetState createState() => _FavArticleWidgetState();
}


class _FavArticleWidgetState extends State<FavArticleWidget> with SingleTickerProviderStateMixin {
  final ArticleService _articleService = ArticleService();
  late Future<List<ArticleModel>> futureArticles;

  @override
  void initState() {
    super.initState();
    futureArticles = _articleService.getFavoriteArticle();
  }

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      theme: ThemeData.dark(),
      home: Scaffold(
        appBar: AppBar(
          title: Text('Mes Articles Favoris', style: TextStyle(fontFamily: 'LeMonde', fontSize: 30.0, fontWeight: FontWeight.bold, color: Colors.white)),
        ),
        body: Stack(
          children: [
            _buildArticlesList(),
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
          return Center(child: Text('Aucun article mis en favoris.'));
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

