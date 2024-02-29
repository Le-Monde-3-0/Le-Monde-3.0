import 'package:flutter/material.dart';

class ArticlesPage extends StatefulWidget {
  const ArticlesPage({super.key});

  @override
  State<ArticlesPage> createState() => _ArticlesPageState();
}

class _ArticlesPageState extends State<ArticlesPage> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Article'),
      ),
      body: Center(
        child: Text('Article Page'),
      ),
    );
  }
}