class TopicModel {
  int? id;
  final String name;
  String? description;
  String? image;

  TopicModel({
    this.id,
    required this.name,
    this.description,
    this.image,
  });

  factory TopicModel.fromJson(Map<String, dynamic> json, [bool owner = false]) {
    return TopicModel(
      id: json['id'] as int,
      name: json['name'] as String,
      description: json['description'] as String,
      image: json['image'] as String,
    );
  }

  factory TopicModel.fromMap(Map<String, dynamic> map, [bool owner = false]) {
    return TopicModel(
      id: map['id'] as int,
      name: map['name'] as String,
      description: map['description'] as String,
      image: map['image'] as String,
    );
  }
}