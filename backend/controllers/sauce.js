// const { render } = require('../app');
const Sauce = require('../models/sauce');
const fs = require('fs');
// const sauce = require('../models/sauce');

exports.addSauce = (req, res, next) => {
    req.body.sauce = JSON.parse(req.body.sauce);
    const url = req.protocol + '://' + req.get('host');
    // console.log('add sauce', req);
    const sauce = new Sauce({
      name: req.body.sauce.name,
      manufacturer: req.body.sauce.manufacturer,
      description: req.body.sauce.description,
      imageUrl: url + '/images/' + req.file.filename,
      mainPepper: req.body.sauce.mainPepper,
      heat: req.body.sauce.heat,
      userId: req.body.sauce.userId,
      likes: 0,
      dislikes: 0,
      usersLiked: [],
      usersDisliked: [],
    });
    console.log(sauce);
    sauce.save().then(
      () => {
        res.status(201).json({
          message: 'Sauce added successfully!'
        });
      }
    ).catch(
      (error) => {
        res.status(400).json({
          error: error
        });
      }
    );
};
  
exports.getAllSauces = (req, res, next) => {
    Sauce.find().then(
      (Sauces) => {
        res.status(200).json(Sauces);
      }
    ).catch(
      (error) => {
        res.status(400).json({
          error: error
        });
      }
    );
};

exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({_id: req.params.id
      }).then(
        (sauce) => {
          res.status(200).json(sauce);
        }
      ).catch(
        (error) => {
          res.status(404).json({
            error: error
          });
        }
      );
};

exports.modifySauce = (req, res, next) => {
  let sauce = new Sauce({ _id: req.params._id });
  if (req.file) {
    const url = req.protocol + '://' + req.get('host');
    req.body.sauce = JSON.parse(req.body.sauce);
    sauce = {
        _id: req.params.id,
        name: req.body.sauce.name,
        manufacturer: req.body.sauce.manufacturer,
        description: req.body.sauce.description,
        imageUrl: url + '/images/' + req.file.filename,
        mainPepper: req.body.sauce.mainPepper,
        heat: req.body.sauce.heat,
        userId: req.body.sauce.userId,
        // likes: usersLiked.length,
        // dislikes: usersDisliked.length,
      }
    } else {
      sauce = {
        _id: req.params.id,
        name: req.body.name,
        manufacturer: req.body.manufacturer,
        description: req.body.description,
        imageUrl: req.body.imageUrl,
        mainPepper: req.body.mainPepper,
        heat: req.body.heat,
        userId: req.body.sauce.userId,
        // likes: usersLiked.length,
        // dislikes: usersDisliked.length,
      };
    }
    Sauce.updateOne({_id: req.params.id}, sauce).then(
      () => {
        res.status(201).json({
          message: 'This sauce has been updated successfully!'
        });
      }
    ).catch(
      (error) => {
        res.status(400).json({
          error: error
        });
      }
    );
};
  
exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({_id: req.params.id}).then(
        (sauce) => {
          const filename = sauce.imageUrl.split('/images/')[1];
          fs.unlink('images/' + filename, () => {
            Sauce.deleteOne({_id: req.params.id}).then(
                () => {
                  res.status(200).json({
                    message: 'This sauce has been deleted!'
                  });
                }
              ).catch(
                (error) => {
                  res.status(400).json({
                    error: error
                  });
                }
              );
            });
        }
    );
};

exports.modifyLikes = (req, res, next) => {
  Sauce.findOne({_id: req.params.id }).then(
    (sauce) => {
      // if this user is not part of the like/dislike array, then include their like
      if (req.body.likes === 1 && !sauce.usersLiked.includes(req.body.userId) && !sauce.usersDisliked.includes(req.body.userId)) {
        Sauce.updateOne({_id: req.params.id}, {$push: {usersLiked: req.body.userId}}, {$inc: {likes: 1}})
        .then(() => res.status(200).json({message: 'Your rating has been recorded!'}))
        .catch((error) => res.status(400).json({error: error})); 

      } else if (req.body.likes === 0 && sauce.usersLiked.includes(req.body.userId)) {
      // if this user is part of the like array and like = 0, then remove their like
        Sauce.updateOne({_id: req.params.id}, {$pull: {usersLiked: req.body.userId}}, {$inc: {likes: -1}})
        .then(() => res.status(200).json({message: 'Your rating has been recorded!'}))
        .catch((error) => res.status(400).json({error: error}));

      } else if (req.body.dislikes === -1 && !sauce.usersDisliked.includes(req.body.userId) && !sauce.usersLiked.includes(req.body.userId)) {
      // if this user is not part of the like/dislike arrray, then include their dislike          
        Sauce.updateOne({_id: req.params.id}, {$push: {usersDisliked: req.body.userId}}, {$inc: {dislikes: 1}})
        .then(() => res.status(200).json({message: 'Your rating has been recorded!'}))
        .catch((error) => res.status(400).json({error: error})); 
        
      } else if ((req.body.dislikes === 0 && sauce.usersDisliked.includes(req.body.userId))) {
      // if this user is part of the dislike array and dislike = 0, then remove their dislike
        Sauce.updateOne({_id: req.params.id}, {$pull: {usersDisliked: req.body.userId}}, {$inc: {dislikes: -1}})
        .then(() => res.status(200).json({message: 'Your rating has been recorded!'}))
        .catch((error) => res.status(400).json({error: error})); 
      }
      sauce.likes = sauce.usersLiked.length;
      sauce.dislikes = sauce.usersDisliked.length;
      console.log(sauce.usersLiked);
      console.log(sauce.likes);
    }
  ).catch(
    (error) => { res.status(400).json({ error: error })}
    )
};