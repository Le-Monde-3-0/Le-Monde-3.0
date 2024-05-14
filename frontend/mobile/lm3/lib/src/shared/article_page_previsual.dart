import 'package:flutter/material.dart';
import '../models/article.dart';
import '../services/Article_service.dart';

class ArticleDetailPrevisuPage extends StatelessWidget {
  final ArticleService _articleService = ArticleService();
  final ArticleModel article;

  ArticleDetailPrevisuPage({required this.article});

  void _submitArticle(bool draft) async {
    try {
        var result = await _articleService.createArticle("@moi", article.content, "subtile", article.title, article.topic, draft);

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
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                SizedBox(
                  height: 60,
                  child: ElevatedButton(
                    onPressed: () {
                      _submitArticle(true);
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
                      _submitArticle(false);
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