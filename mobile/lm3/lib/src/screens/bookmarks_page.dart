import 'package:flutter/material.dart';

class Bookmarks_Page extends StatefulWidget {
  const Bookmarks_Page({super.key});

  @override
  State<Bookmarks_Page> createState() => _BookmarksPagesState();
}

class _BookmarksPagesState extends State<Bookmarks_Page> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Bookmarks'),
      ),
      body: Center(
        child: Text('Bookmarks Page'),
      ),
    );
  }
}


