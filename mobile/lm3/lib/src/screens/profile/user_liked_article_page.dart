import 'package:flutter/material.dart';

import '../../services/Article_service.dart';
import '../../models/article.dart';
import '../../shared/article_widget.dart';

import 'package:lm3/src/bloc/user/user_bloc.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

class FavArticleWidget extends StatefulWidget {
  @override
  _FavArticleWidgetState createState() => _FavArticleWidgetState();
}


class _FavArticleWidgetState extends State<FavArticleWidget> with SingleTickerProviderStateMixin {
  late final ArticleService _articleService;
  late Future<List<ArticleModel>> futureArticles;

  @override
  void initState() {
    super.initState();
    final userBloc = BlocProvider.of<UserBloc>(context);
    _articleService = ArticleService(userBloc: userBloc);
    futureArticles = _articleService.getFavoriteArticle();
  }

  @override
  Widget build(BuildContext context) {
    return  Scaffold(
        appBar: AppBar(
          title: Text('Mes Articles Favoris', style: TextStyle(fontFamily: 'LeMonde', fontSize: 30.0, fontWeight: FontWeight.bold)),
        ),
        body: Stack(
          children: [
            _buildArticlesList(),
          ],
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

