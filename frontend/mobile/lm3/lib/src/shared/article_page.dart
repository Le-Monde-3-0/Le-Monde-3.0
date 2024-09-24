import 'package:flutter/material.dart';
import '../services/article_service.dart';
import '../models/article.dart';
import '../router/router.dart';

class ArticleDetailPage extends StatelessWidget {
  final ArticleService _articleService = ArticleService();
  final ArticleModel article;
  final bool isBookmarked;

  ArticleDetailPage({required this.article, this.isBookmarked = false});

  void _submitArticle(bool draft, BuildContext context) async {
    try {
      var result = await _articleService.createArticle(
          "@moi", article.content, "subtile", article.title, article.topic, draft);
      ArticlesRoute().go(context);
    } catch (e) {
      print(e.toString());
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(
          article.topic.toUpperCase(),
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
            
            SizedBox(height: 8.0),
            Text(
              article.title,
              style: TextStyle(
                fontSize: 24.0,
                fontWeight: FontWeight.bold,
              ),
            ),
            SizedBox(height: 8.0),
            Text(
              article.authorName,
              style: TextStyle(
                fontSize: 18.0,
                color: Colors.grey[600],
              ),
            ),
            SizedBox(height: 8.0),
            Text(
              article.createdAt.toLocal().toString(),
              style: TextStyle(
                fontSize: 16.0,
                color: Colors.grey,
              ),
            ),
            SizedBox(height: 16.0),
            Text(
              article.content,
              style: TextStyle(
                fontSize: 16.0,
              ),
            ),
          ],
        ),
      ),
      bottomNavigationBar: article.draft
          ? BottomAppBar(
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                children: <Widget>[
                  ElevatedButton(
                    child: Text('Modifier'),
                    onPressed: () {},
                  ),
                  ElevatedButton(
                    child: Text('Publier'),
                    onPressed: () {
                      _submitArticle(false, context);
                    },
                  ),
                ],
              ),
            )
          : BottomAppBar(
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                children: <Widget>[
                  IconButton(
                    icon: Icon(Icons.favorite_border),
                    onPressed: () {},
                  ),
                  IconButton(
                    icon: Icon(Icons.share),
                    onPressed: () {},
                  ),
                  IconButton(
                    icon: Icon(Icons.settings),
                    onPressed: () {},
                  ),
                ],
              ),
            ),
    );
  }
}
