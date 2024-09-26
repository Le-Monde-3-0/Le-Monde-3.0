import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter/material.dart';
import '../../models/article.dart';
import '../../shared/article_widget.dart';

import '../../services/article_service.dart';

//BLOC
import 'package:lm3/src/bloc/user/user_bloc.dart';

class ArticlesPage extends StatefulWidget {
  @override
  _ArticlesPageState createState() => _ArticlesPageState();
}

class _ArticlesPageState extends State<ArticlesPage> {
  late final ArticleService _articleService;
  late Future<List<ArticleModel>> futureDraftArticles;
  late Future<List<ArticleModel>> futurePublishedArticles;

  @override
  void initState() {
    super.initState();
    final userBloc = BlocProvider.of<UserBloc>(context);
    _articleService = ArticleService(userBloc: userBloc);
    futurePublishedArticles = _articleService.getMyPublishedArticle();
    futureDraftArticles = _articleService.getMyDraftArticle();
  }

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      theme: ThemeData.dark(),
      home: Scaffold(
        appBar: AppBar(
          title: Text('Mes Articles', style: TextStyle(fontFamily: 'LeMonde', fontSize: 30.0, fontWeight: FontWeight.bold, color: Colors.white)),
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
    return FutureBuilder<List<List<ArticleModel>>>(
      future: Future.wait([futureDraftArticles, futurePublishedArticles]),
      builder: (context, snapshot) {
        if (snapshot.connectionState == ConnectionState.waiting) {
          return Center(child: CircularProgressIndicator());
        } else if (snapshot.hasError) {
          return Center(child: Text('Erreur: ${snapshot.error}'));
        } else if (snapshot.hasData) {
          List<ArticleModel> draftArticles = snapshot.data![0];
          List<ArticleModel> publishedArticles = snapshot.data![1];
          List<ArticleModel> allArticles = [...draftArticles, ...publishedArticles];

          if (allArticles.isEmpty) {
            return Center(child: Text('Aucun article disponible.'));
          }

          return ListView.builder(
            itemCount: allArticles.length,
            itemBuilder: (context, index) {
              ArticleModel article = allArticles[index];
              bool isDraft = draftArticles.contains(article);

              return _buildArticleItem(article, isDraft);
            },
          );
        } else {
          return Center(child: Text('Aucun article disponible.'));
        }
      },
    );
  }

  Widget _buildArticleItem(ArticleModel article, bool isDraft) {
    return Stack(
      children: [
        ArticleWidget(article: article),
        Positioned(
          top: 8,
          right: 8,
          child: Container(
            padding: EdgeInsets.symmetric(horizontal: 8.0, vertical: 4.0),
            decoration: BoxDecoration(
              color: isDraft ? Colors.orange : Colors.green,
              borderRadius: BorderRadius.circular(12.0),
            ),
            child: Text(
              isDraft ? 'Draft' : 'Published',
              style: TextStyle(
                color: Colors.white,
                fontSize: 12.0,
              ),
            ),
          ),
        ),
      ],
    );
  }
}
